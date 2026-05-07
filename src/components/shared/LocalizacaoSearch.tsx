import { useState, useEffect, useRef } from 'react'
import { HiOutlineMapPin, HiOutlineXMark } from 'react-icons/hi2'
import classNames from 'classnames'

interface NominatimResult {
    place_id: number
    display_name: string
    address: {
        suburb?: string
        neighbourhood?: string
        city_district?: string
        quarter?: string
        city?: string
        town?: string
        village?: string
        municipality?: string
        state?: string
        country?: string
    }
}

interface LocalizacaoValue {
    bairro: string
    cidade: string
}

interface LocalizacaoSearchProps {
    value?: LocalizacaoValue
    onChange?: (value: LocalizacaoValue) => void
    placeholder?: string
    invalid?: boolean
}

function extractLocation(item: NominatimResult): LocalizacaoValue {
    const a = item.address
    const bairro =
        a.suburb ?? a.neighbourhood ?? a.city_district ?? a.quarter ?? ''
    const cidade = a.city ?? a.town ?? a.village ?? a.municipality ?? ''
    return { bairro, cidade }
}

function buildLabel(item: NominatimResult): { primary: string; secondary: string } {
    const { bairro, cidade } = extractLocation(item)
    const state = item.address.state ?? ''
    const primary = bairro || cidade
    const secondary = bairro ? `${cidade}, ${state}` : state
    return { primary, secondary }
}

const LocalizacaoSearch = ({
    value,
    onChange,
    placeholder = 'Buscar bairro ou cidade...',
    invalid,
}: LocalizacaoSearchProps) => {
    const [query, setQuery] = useState(
        value?.bairro
            ? `${value.bairro}, ${value.cidade}`
            : value?.cidade ?? '',
    )
    const [results, setResults] = useState<NominatimResult[]>([])
    const [isLoading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(!!value?.cidade)
    const containerRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const search = async (q: string) => {
        if (q.length < 3) {
            setResults([])
            setIsOpen(false)
            return
        }

        setLoading(true)
        try {
            const params = new URLSearchParams({
                q,
                countrycodes: 'br',
                format: 'json',
                addressdetails: '1',
                limit: '6',
            })
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?${params}`,
                {
                    headers: {
                        'Accept-Language': 'pt-BR',
                        'User-Agent': 'MapPlay/1.0 (projeto academico)',
                    },
                },
            )
            const data: NominatimResult[] = await res.json()
            // Filter out results without a city
            const filtered = data.filter(
                (r) =>
                    r.address.city ||
                    r.address.town ||
                    r.address.village ||
                    r.address.municipality,
            )
            setResults(filtered)
            setIsOpen(filtered.length > 0)
        } catch {
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value
        setQuery(q)
        setSelected(false)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => search(q), 400)
    }

    const handleSelect = (item: NominatimResult) => {
        const loc = extractLocation(item)
        const { primary, secondary } = buildLabel(item)
        setQuery(secondary ? `${primary}, ${secondary.split(',')[0]}` : primary)
        setSelected(true)
        setIsOpen(false)
        onChange?.(loc)
    }

    const handleClear = () => {
        setQuery('')
        setSelected(false)
        setResults([])
        onChange?.({ bairro: '', cidade: '' })
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    className={classNames(
                        'w-full h-11 pl-9 pr-9 rounded-lg border text-sm transition-colors bg-white dark:bg-gray-800 dark:text-white outline-none',
                        'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                        invalid
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-gray-600',
                        selected && 'border-primary bg-primary/5',
                    )}
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <HiOutlineXMark className="text-lg" />
                    </button>
                )}
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-56 overflow-y-auto">
                    {results.map((item) => {
                        const { primary, secondary } = buildLabel(item)
                        return (
                            <li key={item.place_id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(item)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start gap-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                >
                                    <HiOutlineMapPin className="text-primary text-base shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {primary}
                                        </p>
                                        {secondary && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {secondary}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}

            {query.length >= 3 && !isLoading && results.length === 0 && isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-3 text-sm text-gray-500 text-center">
                    Nenhum resultado encontrado
                </div>
            )}
        </div>
    )
}

export default LocalizacaoSearch

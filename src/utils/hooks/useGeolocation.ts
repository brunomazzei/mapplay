import { useState, useEffect } from 'react'
import { Geolocation } from '@capacitor/geolocation'

const SAO_PAULO_DEFAULT: [number, number] = [-23.5505, -46.6333]

export const useGeolocation = () => {
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const get = async () => {
            try {
                const result = await Geolocation.getCurrentPosition({
                    timeout: 10000,
                    enableHighAccuracy: true,
                })
                setPosition([result.coords.latitude, result.coords.longitude])
            } catch {
                setError('Não foi possível obter sua localização')
                setPosition(SAO_PAULO_DEFAULT)
            } finally {
                setLoading(false)
            }
        }
        get()
    }, [])

    return { position, loading, error }
}

import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { HiArrowLeft, HiOutlineArrowDownTray, HiOutlineShieldCheck } from 'react-icons/hi2'
import classNames from 'classnames'
import { CSVLink } from 'react-csv'
import Chart from '@/components/shared/Chart'
import { useEspacoStore } from '@/store/espacoStore'
import { useEventoStore } from '@/store/eventoStore'
import { useForumStore } from '@/store/forumStore'
import { useSessionUser } from '@/store/authStore'
import { ADMIN } from '@/constants/roles.constant'

const SPORT_COLORS: Record<string, string> = {
    basquete: '#f97316',
    futebol: '#22c55e',
    skate: '#6b7280',
}

const AVALIACAO_COLORS = ['#22c55e', '#eab308', '#ef4444']

// ─── Stat card ───────────────────────────────────────────────
const StatCard = ({
    emoji, label, value, sub, color,
}: {
    emoji: string; label: string; value: number | string
    sub?: string; color: string
}) => (
    <div className={classNames('rounded-2xl p-4', color)}>
        <p className="text-2xl mb-0.5">{emoji}</p>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
        {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
)

// ─── Section wrapper ──────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{title}</h5>
        {children}
    </div>
)

// ─── Main ─────────────────────────────────────────────────────
const AdminDashboard = () => {
    const navigate = useNavigate()
    const authority = useSessionUser((s) => s.user.authority)
    const isAdmin = authority?.includes(ADMIN)

    const espacos = useEspacoStore((s) => s.espacos)
    const avaliacoes = useEspacoStore((s) => s.avaliacoes)
    const eventos = useEventoStore((s) => s.eventos)
    const posts = useForumStore((s) => s.posts)

    // ── Computed stats ──────────────────────────────────────────
    const stats = useMemo(() => {
        const validados = espacos.filter((e) => e.status === 'validado')
        const pendentes = espacos.filter((e) => e.status === 'pendente')
        const mutiroes = eventos.filter((e) => e.tipo === 'mutirao')
        return { validados, pendentes, mutiroes }
    }, [espacos, eventos])

    // ── Donut: espaços por modalidade ───────────────────────────
    const sportData = useMemo(() => {
        const validados = espacos.filter((e) => e.status === 'validado')
        const counts = { basquete: 0, futebol: 0, skate: 0 }
        validados.forEach((e) => { counts[e.modalidade]++ })
        return {
            series: [counts.basquete, counts.futebol, counts.skate],
            labels: ['Basquete', 'Futebol', 'Skate'],
            colors: [SPORT_COLORS.basquete, SPORT_COLORS.futebol, SPORT_COLORS.skate],
            counts,
        }
    }, [espacos])

    // ── Bar: avaliações por nível ───────────────────────────────
    const avaliacaoData = useMemo(() => {
        const counts = { otimo: 0, necessita_reparos: 0, somente_revitalizacao: 0 }
        avaliacoes.forEach((a) => { counts[a.nivel]++ })
        return {
            series: [{ name: 'Avaliações', data: [counts.otimo, counts.necessita_reparos, counts.somente_revitalizacao] }],
            xAxis: ['Ótimo', 'Necessita reparos', 'Revitalização'],
            counts,
        }
    }, [avaliacoes])

    // ── Bar: top bairros ────────────────────────────────────────
    const bairroData = useMemo(() => {
        const map: Record<string, number> = {}
        espacos
            .filter((e) => e.status === 'validado' && e.bairro)
            .forEach((e) => { map[e.bairro!] = (map[e.bairro!] ?? 0) + 1 })
        const sorted = Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
        return {
            series: [{ name: 'Espaços', data: sorted.map(([, v]) => v) }],
            xAxis: sorted.map(([k]) => k),
        }
    }, [espacos])

    // ── Críticos ────────────────────────────────────────────────
    const criticos = useMemo(() =>
        espacos.filter(
            (e) => e.status === 'validado' && e.avaliacao === 'somente_revitalizacao',
        ),
    [espacos])

    // ── CSV export ──────────────────────────────────────────────
    const csvData = useMemo(() =>
        espacos.map((e) => ({
            id: e.id, nome: e.nome, modalidade: e.modalidade,
            status: e.status, confirmacoes: e.confirmacoes,
            avaliacao: e.avaliacao ?? 'sem_avaliacao',
            iluminacao: e.iluminacao ? 'Sim' : 'Não',
            bairro: e.bairro ?? '', cidade: e.cidade ?? '',
            latitude: e.lat, longitude: e.lng, cadastrado_em: e.criadoEm,
        })),
    [espacos])

    const csvHeaders = [
        { label: 'ID', key: 'id' }, { label: 'Nome', key: 'nome' },
        { label: 'Modalidade', key: 'modalidade' }, { label: 'Status', key: 'status' },
        { label: 'Confirmações', key: 'confirmacoes' }, { label: 'Avaliação', key: 'avaliacao' },
        { label: 'Iluminação', key: 'iluminacao' }, { label: 'Bairro', key: 'bairro' },
        { label: 'Cidade', key: 'cidade' }, { label: 'Latitude', key: 'latitude' },
        { label: 'Longitude', key: 'longitude' }, { label: 'Cadastrado em', key: 'cadastrado_em' },
    ]

    if (!isAdmin) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
                <HiOutlineShieldCheck className="text-5xl text-gray-300" />
                <h4 className="font-bold text-gray-700">Acesso restrito</h4>
                <p className="text-sm text-gray-500">Esta área é exclusiva para administradores e parceiros governamentais.</p>
                <button onClick={() => navigate(-1)} className="mt-2 text-primary font-semibold text-sm">← Voltar</button>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 shrink-0 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                    <HiArrowLeft className="text-xl text-gray-700" />
                </button>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Dashboard Admin</h4>
                    <p className="text-xs text-gray-500">Visão analítica — RN06</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-1">
                    <HiOutlineShieldCheck className="text-sm" /> Admin
                </span>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <StatCard emoji="📍" label="Espaços validados" value={stats.validados.length} color="bg-green-50 text-green-800" />
                    <StatCard emoji="⏳" label="Aguardando validação" value={stats.pendentes.length} color="bg-orange-50 text-orange-800" />
                    <StatCard emoji="📅" label="Eventos totais" value={eventos.length} sub={`${stats.mutiroes.length} mutirões`} color="bg-blue-50 text-blue-800" />
                    <StatCard emoji="✍️" label="Avaliações" value={avaliacoes.length} sub={`${posts.length} posts no fórum`} color="bg-purple-50 text-purple-800" />
                </div>

                {/* Espaços por modalidade — Donut */}
                <Section title="Espaços por modalidade">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <Chart
                                type="donut"
                                series={sportData.series}
                                height={200}
                                customOptions={{
                                    colors: sportData.colors,
                                    labels: sportData.labels,
                                    plotOptions: {
                                        pie: {
                                            donut: {
                                                size: '80%',
                                                labels: {
                                                    show: true,
                                                    total: {
                                                        show: true, showAlways: true,
                                                        label: 'Total',
                                                        formatter: (w) =>
                                                            w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0),
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    stroke: { colors: ['transparent'] },
                                    dataLabels: { enabled: false },
                                    legend: { show: false },
                                }}
                            />
                        </div>
                        <div className="space-y-2 shrink-0">
                            {(['basquete', 'futebol', 'skate'] as const).map((m, i) => (
                                <div key={m} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: sportData.colors[i] }} />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700">
                                            {m === 'basquete' ? '🏀' : m === 'futebol' ? '⚽' : '🛹'} {sportData.counts[m]}
                                        </p>
                                        <p className="text-xs text-gray-400 capitalize">{m}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Avaliações — Bar horizontal */}
                <Section title="Avaliações de conservação">
                    <Chart
                        type="bar"
                        series={avaliacaoData.series}
                        xAxis={avaliacaoData.xAxis}
                        height={180}
                        customOptions={{
                            colors: AVALIACAO_COLORS,
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                    borderRadius: 4,
                                    borderRadiusApplication: 'end',
                                    distributed: true,
                                },
                            },
                            dataLabels: { enabled: true, style: { fontSize: '11px' } },
                            legend: { show: false },
                            xaxis: { categories: avaliacaoData.xAxis },
                            tooltip: { y: { formatter: (v) => `${v} avaliações` } },
                        }}
                    />
                </Section>

                {/* Top bairros — Bar vertical */}
                <Section title="Espaços por bairro (top 5)">
                    <Chart
                        type="bar"
                        series={bairroData.series}
                        xAxis={bairroData.xAxis}
                        height={200}
                        customOptions={{
                            colors: ['#3b82f6'],
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '50%',
                                    borderRadius: 4,
                                    borderRadiusApplication: 'end',
                                },
                            },
                            dataLabels: { enabled: true, style: { fontSize: '11px' } },
                            legend: { show: false },
                            xaxis: { categories: bairroData.xAxis },
                            yaxis: { tickAmount: 3 },
                            tooltip: { y: { formatter: (v) => `${v} espaços` } },
                        }}
                    />
                </Section>

                {/* Espaços críticos */}
                <Section title={`🚨 Espaços críticos (${criticos.length})`}>
                    {criticos.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2">
                            Nenhum espaço com status crítico.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {criticos.map((e) => (
                                <button
                                    key={e.id}
                                    onClick={() => navigate(`/espacos/${e.id}`)}
                                    className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl text-left"
                                >
                                    <span className="text-xl">
                                        {e.modalidade === 'basquete' ? '🏀' : e.modalidade === 'futebol' ? '⚽' : '🛹'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{e.nome}</p>
                                        <p className="text-xs text-gray-500">{e.bairro}, {e.cidade}</p>
                                    </div>
                                    <span className="text-xs text-red-600 font-semibold shrink-0">Ver →</span>
                                </button>
                            ))}
                        </div>
                    )}
                </Section>

                {/* Exportar CSV */}
                <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={`mapplay-espacos-${new Date().toISOString().split('T')[0]}.csv`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gray-800 text-white text-sm font-semibold"
                >
                    <HiOutlineArrowDownTray className="text-lg" />
                    Exportar dados (CSV)
                </CSVLink>

                <div className="h-4" />
            </div>
        </div>
    )
}

export default AdminDashboard

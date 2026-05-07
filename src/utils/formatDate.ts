const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export const formatEventDate = (data: string, hora: string): string => {
    const [y, m, d] = data.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    const dia = DIAS[date.getDay()]
    const mes = MESES[m - 1]
    const horaFmt = hora.replace(':', 'h')
    return `${dia}, ${d} ${mes} · ${horaFmt}`
}

export const isEventPast = (data: string, hora: string): boolean => {
    const [y, m, d] = data.split('-').map(Number)
    const [h, min] = hora.split(':').map(Number)
    return new Date(y, m - 1, d, h, min) < new Date()
}

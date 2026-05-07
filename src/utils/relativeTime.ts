export const relativeTime = (isoString: string): string => {
    const diff = Date.now() - new Date(isoString).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'agora'
    if (mins < 60) return `${mins}min atrás`
    if (hours < 24) return `${hours}h atrás`
    if (days < 7) return `${days}d atrás`
    return new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

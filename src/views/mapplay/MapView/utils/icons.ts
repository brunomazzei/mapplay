import L from 'leaflet'
import type { Modalidade, StatusEspaco } from '@/types/espaco'

const SPORT_EMOJI: Record<Modalidade, string> = {
    basquete: '🏀',
    futebol: '⚽',
    skate: '🛹',
}

export const createSpaceIcon = (
    modalidade: Modalidade,
    status: StatusEspaco,
) => {
    const emoji = SPORT_EMOJI[modalidade]
    const bg = status === 'validado' ? '#16a34a' : '#f97316'
    const pendenteBadge =
        status === 'pendente'
            ? `<div style="
                position:absolute;top:-5px;right:-5px;
                background:#3b82f6;color:#fff;
                border-radius:50%;width:16px;height:16px;
                font-size:9px;font-weight:700;
                display:flex;align-items:center;justify-content:center;
                border:1.5px solid #fff;
              ">P</div>`
            : ''

    return L.divIcon({
        html: `<div style="position:relative;width:44px;height:44px;">
            <div style="
                width:44px;height:44px;
                background:${bg};
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                border:2.5px solid #fff;
                box-shadow:0 2px 8px rgba(0,0,0,0.3);
                display:flex;align-items:center;justify-content:center;
            ">
                <span style="transform:rotate(45deg);font-size:20px;line-height:1">${emoji}</span>
            </div>
            ${pendenteBadge}
        </div>`,
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -48],
    })
}

export const createUserIcon = () =>
    L.divIcon({
        html: `<div style="
            width:18px;height:18px;
            background:#3b82f6;
            border-radius:50%;
            border:3px solid #fff;
            box-shadow:0 0 0 5px rgba(59,130,246,0.25);
        "></div>`,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    })

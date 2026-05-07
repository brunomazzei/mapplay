import BottomNav from '@/components/template/BottomNav'
import LayoutBase from '@/components/template/LayoutBase'
import { LAYOUT_MOBILE_APP } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'

const MobileApp = ({ children }: CommonProps) => (
    <LayoutBase
        type={LAYOUT_MOBILE_APP}
        className="app-layout-mobile flex flex-col h-[100dvh]"
    >
        <div className="flex-1 min-h-0 overflow-hidden">
            {children}
        </div>
        <BottomNav />
    </LayoutBase>
)

export default MobileApp

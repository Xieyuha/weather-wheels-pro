/**
 * 侧边栏菜单配置
 */

export interface ISidebarItem {
    id: string
    icon: string
    label: string
    /** 点击时触发的动作类型 */
    action?: 'link' | 'toggle'
    /** action 为 link 时的跳转地址 */
    href?: string
}

/** 顶部功能菜单（Logo 下方） */
export const topMenuItems: ISidebarItem[] = [
    { id: 'weather', icon: 'yin', label: '天气' },
    { id: 'layers', icon: 'layers', label: '图层' },
]

/** 底部设置菜单（Exit 上方） */
export const bottomMenuItems: ISidebarItem[] = [
    { id: 'about', icon: 'about', label: '关于' },
    { id: 'github', icon: 'github', label: 'GitHub', action: 'link', href: 'https://github.com' },
]

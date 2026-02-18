import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * UI 全局状态管理
 * 管理侧边栏选中状态、面板显隐等界面交互状态
 */
export const useUIStore = defineStore('ui', () => {
    /** 当前激活的侧边栏项 ID，null 表示无激活 */
    const activeSidebarItem = ref<string | null>(null)

    /** 切换侧边栏项：点击已激活的则关闭，否则激活 */
    const toggleSidebarItem = (id: string) => {
        activeSidebarItem.value = activeSidebarItem.value === id ? null : id
    }

    /** 直接设置激活项 */
    const setActiveSidebarItem = (id: string | null) => {
        activeSidebarItem.value = id
    }

    return {
        activeSidebarItem,
        toggleSidebarItem,
        setActiveSidebarItem,
    }
})

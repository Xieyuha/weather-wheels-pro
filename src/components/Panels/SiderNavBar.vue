<template>
    <div class="sider-nav-bar">
        <div class="top-section">
            <div class="logo">
                <svg-icon name="logo" class="icon" />
            </div>
            <div
                v-for="item in topMenuItems"
                :key="item.id"
                class="bar-item"
                :class="{ active: uiStore.activeSidebarItem === item.id }"
                @click="handleClick(item)"
            >
                <svg-icon :name="item.icon" class="icon" />
            </div>
        </div>

        <div class="bottom-section">
            <div
                v-for="item in bottomMenuItems"
                :key="item.id"
                class="bar-item"
                :class="{ active: uiStore.activeSidebarItem === item.id }"
                @click="handleClick(item)"
            >
                <svg-icon :name="item.icon" class="icon" />
            </div>
            <div class="exit bar-item" @click="handleExit">
                <svg-icon name="exit" class="icon" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import SvgIcon from '@/components/ui/SvgIcon.vue'
    import { topMenuItems, bottomMenuItems } from '@/config/menu'
    import { useUIStore } from '@/stores/useUIStore'
    import type { ISidebarItem } from '@/config/menu'

    const uiStore = useUIStore()

    const handleClick = (item: ISidebarItem) => {
        if (item.action === 'link' && item.href) {
            window.open(item.href, '_blank')
            return
        }
        uiStore.toggleSidebarItem(item.id)
    }

    const handleExit = () => {
        // 预留退出逻辑
        console.log('exit')
    }
</script>

<style scoped>
    .sider-nav-bar {
        width: var(--layout-sider-width);
        height: 100%;
        background: var(--bg-deep);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }

    .top-section,
    .bottom-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .bar-item {
        width: 100%;
        height: var(--layout-bar-item-height);
        padding: 12px;
        position: relative;
        display: flex;
        color: var(--text-tertiary);
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: var(--transition-base);
    }

    /* indicator: 左侧细高亮条，默认隐藏，hover/active 显现 */
    .bar-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%) scaleY(0);
        width: 2px;
        height: 24px;
        background: var(--color-primary);
        border-radius: 0 var(--radius-pill) var(--radius-pill) 0;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bar-item:hover {
        color: var(--color-primary-hover);
        background: var(--color-primary-soft);
    }

    .bar-item:hover::before {
        transform: translateY(-50%) scaleY(0.6);
    }

    .bar-item.active {
        color: var(--color-primary);
        background: var(--color-primary-soft);
    }

    .bar-item.active::before {
        transform: translateY(-50%) scaleY(1);
        box-shadow: 0 0 12px var(--color-primary-glow);
    }

    .icon {
        width: 30px;
        height: 30px;
        transition: var(--transition-transform);
    }

    .bar-item:hover .icon {
        transform: scale(1.08);
    }

    .logo {
        width: 100%;
        height: var(--layout-header-height);
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--gradient-primary);
        color: var(--color-primary-light);
        box-shadow:
            inset 0 -1px 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        position: relative;
    }

    .logo::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.18), transparent 60%);
        pointer-events: none;
    }

    .logo .icon {
        width: 28px;
        height: 28px;
        position: relative;
        z-index: 1;
    }

    .exit {
        margin-top: 8px;
    }

    .exit::before {
        content: '';
        position: absolute;
        top: 0;
        left: 12px;
        right: 12px;
        height: 1px;
        background: var(--border-subtle);
    }

    .exit:hover {
        color: var(--color-danger);
        background: rgba(224, 100, 100, 0.08);
    }

    .exit:hover::before {
        display: none;
    }
</style>
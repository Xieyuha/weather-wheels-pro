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
        width: 65px;
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
        height: 65px;
        padding: 12px 12px;
        position: relative;
        display: flex;
        color: #98989a;
        justify-content: center;
        align-items: center;
        border-left: 3px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            color: #d2b0a2;
            background: var(--gradient-bg-card);
            border-left: 3px solid #b55e40;
        }
    }

    .bar-item.active {
        color: #d2b0a2;
        background: var(--gradient-bg-card);
        border-left: 3px solid #b55e40;
    }

    .icon {
        width: 35px;
        height: 35px;
    }

    .logo {
        width: 100%;
        height: 65px;
        padding: 12px 12px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1.5px solid var(--bg-border);
        color: #ffd8c2;
        background-color: #b55e40;
    }

    .exit {
        border-top: 1.5px solid var(--bg-border);
    }
</style>
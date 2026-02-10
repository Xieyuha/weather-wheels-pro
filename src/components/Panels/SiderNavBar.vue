<template>
    <div class="sider-nav-bar">
        <div class="logo">
            <svg-icon name="logo" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import SvgIcon from '@/components/ui/SvgIcon.vue';
</script>

<style scoped>
    .sider-nav-bar {
        width: 65px;
        height: 100%;
        background: var(--bg-deep);
    }
</style>
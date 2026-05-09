<template>
    <div class="header">
        <el-button class="ghost-btn">Date</el-button>
        <el-select
            v-model="mapType"
            class="map-select"
            placeholder="Map Type"
            size="small"
        >
            <el-option
                v-for="(value, index) in MapType"
                :key="index"
                :label="value"
                :value="value"
            />
        </el-select>
        <el-button class="ghost-btn">Profile</el-button>
        <el-button class="ghost-btn">Settings</el-button>
    </div>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/stores/useMapStore';
    import { storeToRefs } from 'pinia';
    import { MapType } from '@/adapter/map/types';
import { Model } from 'cesium';

    const mapStore = useMapStore();
    const { mapType } = storeToRefs(mapStore);
</script>

<style scoped>
    .header {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .ghost-btn {
        --el-button-bg-color: transparent;
        --el-button-border-color: var(--border-subtle);
        --el-button-text-color: var(--text-secondary);
        --el-button-hover-bg-color: var(--bg-hover);
        --el-button-hover-border-color: var(--border-strong);
        --el-button-hover-text-color: var(--text-primary);
        height: 32px;
        padding: 0 14px;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--letter-spacing-tight);
    }

    :deep(.el-select) {
        width: 110px;
    }

    :deep(.el-select .el-input__wrapper) {
        height: 32px;
        background: transparent !important;
        box-shadow: 0 0 0 1px var(--border-subtle) inset !important;
    }

    :deep(.el-select .el-input__wrapper:hover) {
        box-shadow: 0 0 0 1px var(--border-strong) inset !important;
    }
</style>

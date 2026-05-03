<template>
    <div class="header">
        <el-button>Date</el-button>
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
        <el-button>Profile</el-button>
        <el-button>Settings</el-button>
    </div>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/stores/useMapStore';
    import { storeToRefs } from 'pinia';
    import { MapType } from '@/adapter/map/types';

    const mapStore = useMapStore();
    const { mapType } = storeToRefs(mapStore);
</script>

<style scoped>
    .header {
        display: flex;
        gap: 8px;
        align-items: center;
        color: var(--text-main);
    }

    :deep(.el-select) {
        width: 100px;
    }
</style>

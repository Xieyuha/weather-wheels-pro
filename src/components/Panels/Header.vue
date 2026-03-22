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
import { Model } from 'cesium';

    const mapStore = useMapStore();
    const { mapType } = storeToRefs(mapStore);

</script>

<style scoped>
    .header {
        width: 100%;
        height: 100%;
        display: flex;
        gap: 5px;
        padding: 5px;
        /* 前三个数字是 RGB，最后一个 0.8 是 80% 的不透明度 */
        /* background-color: rgba(52, 152, 219, 0.8); */
        color: white;
        /* 文字依然清晰可见 */
    }

    .el-button {
        margin: 0;
    }

    :deep(.el-tooltip__trigger) {
        width: 80px;
    }

    :deep(.el-select) {
        width: 80px;
    }
</style>
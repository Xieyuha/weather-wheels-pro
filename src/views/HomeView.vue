<template>
    <div class="home-view">
        <el-container>
            <el-aside>
                <SiderNavBar />
                <FeaturePanel />
            </el-aside>
            <el-container>
                <Header />
                <MapContainer />
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
    import Header from '@/components/Panels/Header.vue';
    import SiderNavBar from '@/components/Panels/SiderNavBar.vue';
    import FeaturePanel from '@/components/Panels/FeaturePanel.vue';
    import MapContainer from '@/components/Map/MapContainer.vue';
</script>

<style scoped>
    .el-aside {
        height: 100vh;
        display: flex;
    }
</style>
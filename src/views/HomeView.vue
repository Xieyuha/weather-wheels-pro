<template>
    <div class="home-view">
        <el-container>
            <el-aside class="sider-container">
                <SiderNavBar />
                <FeaturePanel />
            </el-aside>
            <el-container class="main-container">
                <el-header class="app-header">
                    <Header />
                </el-header>
                <el-main class="map-main">
                    <MapContainer />
                </el-main>
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
    .home-view {
        background: var(--bg-base);
    }

    .sider-container {
        height: 100vh;
        width: var(--layout-aside-width);
        display: flex;
        position: relative;
        z-index: 2;
        box-shadow: var(--shadow-md);
    }

    .main-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .app-header {
        height: var(--layout-header-height);
        background: var(--bg-panel);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 20px;
        position: relative;
        z-index: 1;
        box-shadow: 0 1px 0 var(--border-subtle), var(--shadow-sm);
    }

    .map-main {
        flex: 1;
        overflow: hidden;
    }
</style>

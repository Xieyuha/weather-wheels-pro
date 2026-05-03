<template>
    <div class="feature-panel-wrapper">
        <div class="feature-panel">
            <h1 class="header">WindWise</h1>
            <div class="content">
                <div class="card"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .feature-panel-wrapper {
        display: flex;
        height: 100%;
        overflow: hidden;
    }

    .feature-panel {
        width: var(--layout-feature-panel-width);
        height: 100%;
        background: var(--bg-panel);
        border-right: 1px solid var(--bg-border);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .header {
        height: var(--layout-header-height);
        padding: 0 20px;
        color: var(--text-main);
        font-size: var(--font-size-h1);
        border-bottom: 1px solid var(--bg-border);
        display: flex;
        align-items: center;
    }

    .content {
        flex: 1;
        padding: 20px;
        overflow: auto;
    }

    .card {
        height: 250px;
        border: 1px solid var(--bg-border);
        background: var(--gradient-bg-card);
        border-radius: var(--panel-border-radius);
    }
</style>

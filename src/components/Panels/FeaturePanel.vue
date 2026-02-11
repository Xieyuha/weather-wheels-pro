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
        width: 370px;
        height: 100%;
        background: var(--bg-panel);
        overflow: hidden;
    }

    .header {
        height: 65px;
        border: 1.5px solid var(--bg-border);
        border-top: none;
        padding: 20px 20px;
        color: var(--h1-color);
        font-size: var(--h1-font-size);
        display: flex;
        align-items: center;
    }

    .content {
        height: calc(100% - 65px);
        border: 1.5px solid var(--bg-border);
        border-top: none;
        padding: 20px;
    }

    .card {
        height: 250px;
        border: 1.5px solid var(--bg-border);
        background: var(--gradient-bg-card);
        border-radius: var(--panel-border-radius);
    }
</style>
<template>
    <div class="feature-panel">
        <div class="header"></div>
        <div class="content">

            <div class="card">
            </div>
        </div>
    </div>
</template>

<script setup >

</script>

<style scoped>
    .feature-panel {
        width: 350px;
        height: 100%;
        background: var(--bg-panel);
    }

    .header {
        height: 65px;
        border: 1.5px solid var(--bg-border);
        border-top: none;
    }

    .content {
        height: calc(100% - 65px);
        border: 1.5px solid var(--bg-border);
        border-top: none;
        padding: 20px;
        flex: 1;
    }

    .card {
        height: 250px;
        border: 1.5px solid var(--bg-border);
        background: var(--gradient-bg-card);
        border-radius: var(--panel-border-radius);
    }
</style>
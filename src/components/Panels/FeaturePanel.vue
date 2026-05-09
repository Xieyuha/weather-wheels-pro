<template>
    <div class="feature-panel-wrapper">
        <div class="feature-panel">
            <div class="panel-header">
                <h1 class="brand">WindWise</h1>
                <span class="brand-tag">PRO</span>
            </div>
            <div class="content">
                <div class="card">
                    <div class="card-glow"></div>
                </div>
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
        background: var(--gradient-panel);
        border-right: 1px solid var(--border-subtle);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .panel-header {
        height: var(--layout-header-height);
        padding: 0 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid var(--border-subtle);
        background: linear-gradient(180deg, rgba(236, 106, 61, 0.04), transparent);
    }

    .brand {
        font-size: var(--font-size-h1);
        font-weight: var(--font-weight-semibold);
        letter-spacing: var(--letter-spacing-tighter);
        color: var(--text-primary);
        background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .brand-tag {
        font-size: 10px;
        font-weight: var(--font-weight-semibold);
        letter-spacing: 0.08em;
        color: var(--color-primary);
        background: var(--color-primary-soft);
        border: 1px solid var(--color-primary-soft);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        text-transform: uppercase;
    }

    .content {
        flex: 1;
        padding: 20px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .card {
        position: relative;
        height: 220px;
        background: var(--gradient-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm), var(--shadow-inset-top);
        overflow: hidden;
        cursor: pointer;
        transition: var(--transition-base);
    }

    .card:hover {
        transform: translateY(-2px);
        border-color: var(--border-default);
        box-shadow: var(--shadow-md), var(--shadow-inset-top);
    }

    /* 顶部柔光：模拟主色微微泛起的光感 */
    .card-glow {
        position: absolute;
        top: -40%;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
        height: 80%;
        background: radial-gradient(ellipse at center, var(--color-primary-glow) 0%, transparent 70%);
        opacity: 0.5;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .card:hover .card-glow {
        opacity: 0.85;
    }
</style>

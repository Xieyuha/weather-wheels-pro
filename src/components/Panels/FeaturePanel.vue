<template>
    <div class="feature-panel-wrapper">
        <div class="feature-panel">
            <div class="panel-header">
                <h1 class="brand">WindWise</h1>
                <span class="brand-tag">PRO</span>
            </div>
            <div class="content">

                <!-- LOD 状态指示器 -->
                <div class="section">
                    <div class="section-row">
                        <span class="section-title">数据分辨率</span>
                        <span class="lod-badge" :style="{ color: lodColor }">{{ lodLabel }}</span>
                    </div>
                    <div class="section-desc">LOD 级别 {{ mapStore.zoomLevel + 1 }} / 3，缩放时自动切换</div>
                </div>

                <div class="divider" />

                <!-- 粒子参数 -->
                <div class="section">
                    <div class="section-title">粒子参数</div>

                    <div class="param-row">
                        <span class="param-label">速度倍率</span>
                        <span class="param-val">× {{ windStore.speedMultiplier.toFixed(1) }}</span>
                    </div>
                    <el-slider
                        :model-value="windStore.speedMultiplier"
                        :min="0.2" :max="3.0" :step="0.1"
                        :show-tooltip="false"
                        @input="onSpeedInput"
                    />

                    <div class="param-row">
                        <span class="param-label">粒子数量</span>
                        <span class="param-val">{{ windStore.particleCount.toLocaleString() }}</span>
                    </div>
                    <el-slider
                        :model-value="windStore.particleCount"
                        :min="200" :max="10000" :step="200"
                        :show-tooltip="false"
                        @change="onCountChange"
                    />

                    <div class="param-row">
                        <span class="param-label">尾迹长度</span>
                        <span class="param-val">{{ Math.round((windStore.fadeOpacity - 0.80) / (0.97 - 0.80) * 100) }}%</span>
                    </div>
                    <el-slider
                        :model-value="windStore.fadeOpacity"
                        :min="0.80" :max="0.97" :step="0.01"
                        :show-tooltip="false"
                        @input="onFadeInput"
                    />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/useMapStore'
import { useWindStore } from '@/stores/useWindStore'

const mapStore = useMapStore()
const windStore = useWindStore()

const LOD_LABELS = ['1.0°', '0.5°', '0.25°']
const LOD_COLORS = ['var(--text-secondary)', 'var(--color-warning)', 'var(--color-success)']

const lodLabel = computed(() => LOD_LABELS[mapStore.zoomLevel] ?? '1.0°')
const lodColor = computed(() => LOD_COLORS[mapStore.zoomLevel] ?? 'var(--text-secondary)')

function unwrap(v: number | number[]): number { return Array.isArray(v) ? v[0]! : v }

function onSpeedInput(v: number | number[]) { windStore.applySpeedMultiplier(unwrap(v)) }
function onCountChange(v: number | number[]) { windStore.applyParticleCount(unwrap(v)) }
function onFadeInput(v: number | number[]) { windStore.applyFadeOpacity(unwrap(v)) }
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
        flex-shrink: 0;
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
        padding: 16px 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .section {
        padding: 14px 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .section-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section-title {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    .lod-badge {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
        transition: color 0.3s ease;
    }

    .section-desc {
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
        line-height: 1.5;
    }

    .divider {
        height: 1px;
        background: var(--border-subtle);
    }

    .param-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: -4px;
    }

    .param-label {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
    }

    .param-val {
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        font-variant-numeric: tabular-nums;
        font-weight: var(--font-weight-medium);
    }

    /* el-slider 间距收紧 */
    :deep(.el-slider) {
        margin-bottom: 6px;
    }
</style>

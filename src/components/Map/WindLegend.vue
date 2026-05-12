<template>
    <div class="wind-legend">
        <div class="legend-header">
            <span class="legend-title">风速</span>
            <span v-if="windStore.hoverWindSpeed !== null" class="hover-val">
                {{ windStore.hoverWindSpeed.toFixed(1) }} m/s
            </span>
            <span v-else class="hover-hint">悬停查看</span>
        </div>
        <div class="gradient-wrap">
            <canvas ref="canvasRef" width="200" height="8" class="gradient-canvas" />
            <div
                v-if="markerPct !== null"
                class="speed-marker"
                :style="{ left: markerPct + '%' }"
            />
        </div>
        <div class="tick-row">
            <span class="tick-start">0</span>
            <span class="tick-mid">5</span>
            <span class="tick-end">12 m/s</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWindStore } from '@/stores/useWindStore'
import { speedToRGB } from '@/services/wind/color'

const MAX_SPEED = 12

const windStore = useWindStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const markerPct = computed(() => {
    if (windStore.hoverWindSpeed === null) return null
    return Math.min(100, (windStore.hoverWindSpeed / MAX_SPEED) * 100)
})

onMounted(() => {
    const canvas = canvasRef.value!
    const ctx = canvas.getContext('2d')!
    const w = canvas.width
    const h = canvas.height
    for (let i = 0; i < w; i++) {
        const speed = (i / w) * MAX_SPEED
        const [r, g, b] = speedToRGB(speed)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(i, 0, 1, h)
    }
})
</script>

<style scoped>
.wind-legend {
    position: absolute;
    bottom: 28px;
    left: 20px;
    background: rgba(14, 16, 20, 0.88);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 10px 14px;
    backdrop-filter: blur(10px);
    width: 190px;
    pointer-events: none;
}

.legend-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.legend-title {
    font-size: 11px;
    font-weight: var(--font-weight-semibold);
    color: var(--text-secondary);
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.hover-val {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
}

.hover-hint {
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
}

.gradient-wrap {
    position: relative;
    margin-bottom: 5px;
}

.gradient-canvas {
    display: block;
    width: 100%;
    height: 8px;
    border-radius: 3px;
}

.speed-marker {
    position: absolute;
    top: -3px;
    width: 2px;
    height: 14px;
    background: #fff;
    border-radius: 1px;
    transform: translateX(-50%);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

.tick-row {
    position: relative;
    height: 16px;
}

.tick-start {
    position: absolute;
    left: 0;
    font-size: 10px;
    color: var(--text-tertiary);
}

.tick-mid {
    position: absolute;
    left: 41.7%;
    font-size: 10px;
    color: var(--text-tertiary);
    transform: translateX(-50%);
}

.tick-end {
    position: absolute;
    right: 0;
    font-size: 10px;
    color: var(--text-tertiary);
}
</style>

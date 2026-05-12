import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import type { WindLayerOrchestrator, WindUserOptions } from '@/layers/wind/WindLayerOrchestrator'
import type { WindField } from '@/services/wind/types'

export type { WindUserOptions }

export const useWindStore = defineStore('wind', {
    state: () => ({
        orchestrator: null as WindLayerOrchestrator | null,
        windField: null as WindField | null,
        speedMultiplier: 1.0,
        particleCount: 2000,
        fadeOpacity: 0.92,
        hoverWindSpeed: null as number | null,
    }),
    actions: {
        setOrchestrator(o: WindLayerOrchestrator, wf: WindField) {
            this.orchestrator = markRaw(o)
            this.windField = markRaw(wf)
            o.setUserOptions({
                speedMultiplier: this.speedMultiplier,
                particleCount: this.particleCount,
                fadeOpacity: this.fadeOpacity,
            })
        },
        clearOrchestrator() {
            this.orchestrator = null
            this.windField = null
            this.hoverWindSpeed = null
        },
        applySpeedMultiplier(v: number) {
            this.speedMultiplier = v
            this.orchestrator?.setUserOptions({ speedMultiplier: v })
        },
        applyParticleCount(v: number) {
            this.particleCount = v
            this.orchestrator?.setUserOptions({ particleCount: v })
        },
        applyFadeOpacity(v: number) {
            this.fadeOpacity = v
            this.orchestrator?.setUserOptions({ fadeOpacity: v })
        },
        setHoverWindSpeed(speed: number | null) {
            if (speed === null) {
                if (this.hoverWindSpeed !== null) this.hoverWindSpeed = null
                return
            }
            if (this.hoverWindSpeed !== null && Math.abs(speed - this.hoverWindSpeed) < 0.1) return
            this.hoverWindSpeed = speed
        },
    },
})

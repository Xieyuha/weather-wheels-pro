import type { WindField, WindBounds, Particle, DrawCommand } from './types';
import { createParticle, stepParticle } from './particle';
import { sampleWind } from './interpolate';

export class WindParticleSystem {
    private particles: Particle[];

    constructor(
        private windField: WindField,
        count: number,
        private scale: number,
        private maxAlpha: number,
        private spawnBounds: WindBounds = windField.meta.bounds,
    ) {
        this.particles = Array.from({ length: count }, () => createParticle(this.spawnBounds));
    }

    updateSpawnBounds(bounds: WindBounds | undefined) {
        if (bounds) this.spawnBounds = bounds
    }

    setScale(scale: number) {
        this.scale = scale
    }

    setCount(n: number) {
        if (n > this.particles.length) {
            const add = Array.from({ length: n - this.particles.length }, () => createParticle(this.spawnBounds))
            this.particles.push(...add)
        } else {
            this.particles.length = n
        }
    }

    // 步进所有粒子，输出要画什么，但不管怎么画
    step(): DrawCommand[] {
        try {
            const commands: DrawCommand[] = []
            this.particles.forEach(p => {
                const prevLon = p.lon, prevLat = p.lat
                const alive = stepParticle(p, this.windField, this.scale)
                if (!alive) {
                    // 重置,这帧不绘制，可能造成粒子过度集中在边界，与闪烁，后续可以考虑淡出重置
                    Object.assign(p, createParticle(this.spawnBounds))
                    return
                }
                const wind = sampleWind(this.windField, p.lon, p.lat)
                if (!wind) return
                commands.push({
                    prevLon,
                    prevLat,
                    lon: p.lon,
                    lat: p.lat,
                    speed: Math.sqrt(wind.u ** 2 + wind.v ** 2),
                    alpha: Math.min(p.age / 15, 1) * this.maxAlpha,
                })
            })
            return commands
        }
        catch (e) {
            console.error('Error in WindParticleSystem.step:', e);
            return [];
        }

    }
}

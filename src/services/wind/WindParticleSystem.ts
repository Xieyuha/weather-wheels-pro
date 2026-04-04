import type { WindField, Particle, DrawCommand } from './types';
import { createParticle, stepParticle } from './particle';
import { sampleWind } from './interpolate';

export class WindParticleSystem {
    private particles: Particle[];

    constructor(
        private windField: WindField,
        private count = 2000,
        private speedFactor = 0.008,
    ) {
        this.particles = Array.from({ length: this.count },
            () => createParticle(windField.meta.bounds)
        );
    }

    // 步进所有粒子，输出要画什么，但不管怎么画
    step(): DrawCommand[] {
        try {
            const commands: DrawCommand[] = []
            this.particles.forEach(p => {
                const prevLon = p.lon, prevLat = p.lat
                const alive = stepParticle(p, this.windField, this.speedFactor)
                if (!alive) {
                    // 重置
                    Object.assign(p, createParticle(this.windField.meta.bounds))
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
                    alpha: Math.min(p.age / 15, 1) * 0.85,
                })
            })
            return commands
        }
        catch (e) {
            throw new Error('Not implemented');
        }

    }
}

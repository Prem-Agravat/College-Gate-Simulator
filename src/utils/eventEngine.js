import { eventWeights } from '../data/events'
import { weightedPick, randInt, chance } from './random'

/**
 * Periodic event engine — call tick() on an interval while simulation runs.
 * Returns an event type string or null.
 */
export function createEventEngine({ context = 'idle', minMs = 10000, maxMs = 30000 } = {}) {
  let nextAt = Date.now() + randInt(minMs, maxMs)
  let paused = false
  let currentContext = context

  return {
    setContext(ctx) {
      currentContext = ctx
    },
    pause() {
      paused = true
    },
    resume() {
      paused = false
      nextAt = Date.now() + randInt(minMs, maxMs)
    },
    tick() {
      if (paused) return null
      if (Date.now() < nextAt) return null
      nextAt = Date.now() + randInt(minMs, maxMs)
      // Sometimes skip so it never feels metronomic
      if (chance(0.18)) return null
      const weights = eventWeights[currentContext] || eventWeights.idle
      return weightedPick(weights)
    },
    force(type) {
      nextAt = Date.now() + randInt(minMs, maxMs)
      return type
    },
  }
}

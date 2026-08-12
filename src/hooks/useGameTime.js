import { useCallback, useEffect, useRef, useState } from 'react'
import { formatGameTime, getPeriodForMinutes } from '../data/events'

/** Simulated college clock — advances faster than real time */
export function useGameTime({
  startMinutes = 8 * 60 + 47,
  speed = 18, // sim seconds per real second roughly via minutes tick
  paused = false,
  onPeriodChange,
} = {}) {
  const [minutes, setMinutes] = useState(startMinutes)
  const periodRef = useRef(getPeriodForMinutes(startMinutes))

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setMinutes((m) => {
        const next = m + 1
        // wrap college day 08:00–17:59
        const wrapped = next > 17 * 60 + 50 ? 8 * 60 : next
        const period = getPeriodForMinutes(wrapped)
        if (period.id !== periodRef.current.id) {
          periodRef.current = period
          onPeriodChange?.(period)
        }
        return wrapped
      })
    }, Math.max(800, 60000 / speed))
    return () => clearInterval(id)
  }, [paused, speed, onPeriodChange])

  const setTime = useCallback((mins) => setMinutes(mins), [])
  const jump = useCallback((delta) => setMinutes((m) => m + delta), [])

  const period = getPeriodForMinutes(minutes)

  return {
    minutes,
    timeLabel: formatGameTime(minutes),
    period,
    setTime,
    jump,
  }
}

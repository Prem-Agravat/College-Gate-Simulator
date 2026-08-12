export function pick(arr) {
  if (!arr?.length) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

export function chance(p = 0.5) {
  return Math.random() < p
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function weightedPick(weightMap) {
  const entries = Object.entries(weightMap)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let r = Math.random() * total
  for (const [key, w] of entries) {
    r -= w
    if (r <= 0) return key
  }
  return entries[0]?.[0]
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

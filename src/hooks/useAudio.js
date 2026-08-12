import { useCallback, useEffect, useRef, useState } from 'react'
import { PLAYLIST } from '../data/music'

/**
 * Modular audio manager.
 * - Starts only after user gesture (unlock)
 * - Prefers /public/audio files; synthesizes fallbacks when missing
 */
export function useAudio() {
  const ctxRef = useRef(null)
  const nodesRef = useRef({})
  const musicRef = useRef(null)
  const unlockedRef = useRef(false)
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolume] = useState(0.55)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const enabledRef = useRef(true)
  const volumeRef = useRef(0.55)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    volumeRef.current = volume
    if (ctxRef.current) ctxRef.current.destination.gain?.setValueAtTime?.(volume, 0)
    Object.values(nodesRef.current).forEach((n) => {
      if (n?.gain) n.gain.value = volume * (n.role === 'ambient' ? 0.35 : 0.5)
    })
    if (musicRef.current) musicRef.current.volume = volume * 0.45
  }, [volume])

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctxRef.current = new AC()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const beep = useCallback((freq = 440, dur = 0.12, type = 'sine', gain = 0.08) => {
    if (!enabledRef.current || !unlockedRef.current) return
    const ctx = ensureCtx()
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.value = gain * volumeRef.current
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    o.stop(ctx.currentTime + dur)
  }, [ensureCtx])

  const playFile = useCallback(async (src, { loop = false, category = 'effects' } = {}) => {
    if (!enabledRef.current || !unlockedRef.current) return null
    try {
      const audio = new Audio(src)
      audio.loop = loop
      audio.volume = volumeRef.current * (loop ? 0.3 : 0.5)
      await audio.play()
      return audio
    } catch {
      // fallback synthesis by category
      if (category === 'gate') beep(180, 0.25, 'triangle', 0.1)
      else if (category === 'notification') beep(880, 0.08, 'square', 0.06)
      else if (category === 'phone') {
        beep(700, 0.15, 'square', 0.05)
        setTimeout(() => beep(700, 0.15, 'square', 0.05), 200)
      } else if (category === 'chai') beep(320, 0.2, 'sine', 0.05)
      else if (category === 'bell') {
        beep(660, 0.4, 'sine', 0.09)
        setTimeout(() => beep(880, 0.5, 'sine', 0.07), 180)
      } else if (category === 'horn') beep(220, 0.3, 'sawtooth', 0.04)
      else if (category === 'footsteps') {
        beep(90, 0.05, 'triangle', 0.04)
        setTimeout(() => beep(80, 0.05, 'triangle', 0.04), 280)
      }
      return null
    }
  }, [beep])

  const startAmbient = useCallback(() => {
    if (!enabledRef.current || !unlockedRef.current) return
    const ctx = ensureCtx()
    if (!ctx || nodesRef.current.ambient) return

    // Soft procedural campus hum + birds-ish high ticks
    const master = ctx.createGain()
    master.gain.value = 0.12 * volumeRef.current
    master.connect(ctx.destination)

    const hum = ctx.createOscillator()
    hum.type = 'sine'
    hum.frequency.value = 110
    const humGain = ctx.createGain()
    humGain.gain.value = 0.35
    hum.connect(humGain)
    humGain.connect(master)
    hum.start()

    const wind = ctx.createOscillator()
    wind.type = 'triangle'
    wind.frequency.value = 55
    const windGain = ctx.createGain()
    windGain.gain.value = 0.15
    wind.connect(windGain)
    windGain.connect(master)
    wind.start()

    nodesRef.current.ambient = { stop: () => { hum.stop(); wind.stop(); master.disconnect() }, gain: master, role: 'ambient' }

    // Try real ambient file in parallel (silently fails if missing)
    playFile('/audio/ambient/campus-morning.mp3', { loop: true, category: 'ambient' }).then((a) => {
      if (a) {
        a.volume = 0.25 * volumeRef.current
        nodesRef.current.ambientFile = a
      }
    })
  }, [ensureCtx, playFile])

  const unlock = useCallback(() => {
    unlockedRef.current = true
    ensureCtx()
    if (enabledRef.current) startAmbient()
  }, [ensureCtx, startAmbient])

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v
      if (!next) {
        nodesRef.current.ambient?.stop?.()
        nodesRef.current.ambient = null
        nodesRef.current.ambientFile?.pause?.()
        musicRef.current?.pause()
        setMusicPlaying(false)
      } else if (unlockedRef.current) {
        startAmbient()
      }
      return next
    })
  }, [startAmbient])

  const sfx = useCallback((name) => {
    const map = {
      footsteps: () => playFile('/audio/effects/footsteps.mp3', { category: 'footsteps' }),
      gateOpen: () => playFile('/audio/effects/gate-open.mp3', { category: 'gate' }),
      gateClose: () => playFile('/audio/effects/gate-close.mp3', { category: 'gate' }),
      horn: () => playFile('/audio/effects/horn.mp3', { category: 'horn' }),
      phone: () => playFile('/audio/effects/phone-buzz.mp3', { category: 'phone' }),
      chai: () => playFile('/audio/effects/chai-pour.mp3', { category: 'chai' }),
      bell: () => playFile('/audio/effects/bell.mp3', { category: 'bell' }),
      notification: () => playFile('/audio/effects/notification.mp3', { category: 'notification' }),
      dialogue: () => beep(240, 0.06, 'sine', 0.05),
    }
    map[name]?.()
  }, [playFile, beep])

  const playMusic = useCallback(async (index = trackIndex) => {
    if (!enabledRef.current || !unlockedRef.current) return
    const track = PLAYLIST[index % PLAYLIST.length]
    setTrackIndex(index % PLAYLIST.length)
    musicRef.current?.pause()
    const audio = new Audio(track.src)
    audio.volume = volumeRef.current * 0.4
    musicRef.current = audio
    try {
      await audio.play()
      setMusicPlaying(true)
      audio.onended = () => {
        const next = (index + 1) % PLAYLIST.length
        playMusic(next)
      }
    } catch {
      // Procedural soft loop as music stand-in
      const ctx = ensureCtx()
      if (!ctx) return
      beep(330, 0.4, 'sine', 0.04)
      setTimeout(() => beep(392, 0.4, 'sine', 0.04), 400)
      setTimeout(() => beep(440, 0.5, 'sine', 0.04), 800)
      setMusicPlaying(true)
    }
  }, [trackIndex, ensureCtx, beep])

  const pauseMusic = useCallback(() => {
    musicRef.current?.pause()
    setMusicPlaying(false)
  }, [])

  const nextTrack = useCallback(() => {
    playMusic((trackIndex + 1) % PLAYLIST.length)
  }, [playMusic, trackIndex])

  const setQuiet = useCallback((quiet) => {
    if (nodesRef.current.ambient?.gain) {
      nodesRef.current.ambient.gain.gain.value = quiet ? 0.03 * volumeRef.current : 0.12 * volumeRef.current
    }
  }, [])

  useEffect(() => () => {
    nodesRef.current.ambient?.stop?.()
    musicRef.current?.pause()
    ctxRef.current?.close?.()
  }, [])

  return {
    enabled,
    volume,
    setVolume,
    musicPlaying,
    trackIndex,
    track: PLAYLIST[trackIndex],
    playlist: PLAYLIST,
    unlock,
    toggle,
    sfx,
    playMusic,
    pauseMusic,
    nextTrack,
    setQuiet,
    startAmbient,
  }
}

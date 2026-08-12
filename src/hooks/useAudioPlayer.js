import { useState, useEffect, useRef } from 'react'

export function useAudioPlayer(currentTrack, autoNext, onTrackEnd) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(currentTrack?.duration || 5)
  const [isMuted, setIsMuted] = useState(false)
  const [dialogueVolume, setDialogueVolume] = useState(0.8)
  const [ambientVolume, setAmbientVolume] = useState(0.3)
  const [audioError, setAudioError] = useState(false)

  // Audio elements refs
  const dialogueAudioRef = useRef(null)
  const ambientAudioRef = useRef(null)

  // Web Audio ambient synthesis fallback refs
  const audioCtxRef = useRef(null)
  const synthGainNodeRef = useRef(null)
  const synthSourceNodeRef = useRef(null)

  // Typewriter or speech interval ref (for fallback mode)
  const fallbackIntervalRef = useRef(null)
  const isFallbackPlayingRef = useRef(false)

  // Keep track of parameters in ref to avoid effect loops
  const onTrackEndRef = useRef(onTrackEnd)
  useEffect(() => {
    onTrackEndRef.current = onTrackEnd
  }, [onTrackEnd])

  // Initialize dialogue audio
  useEffect(() => {
    dialogueAudioRef.current = new Audio()
    
    const audio = dialogueAudioRef.current
    audio.volume = dialogueVolume

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setAudioError(false)
    }

    const handleTimeUpdate = () => {
      if (!isFallbackPlayingRef.current) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      if (autoNext && onTrackEndRef.current) {
        onTrackEndRef.current()
      }
    }

    const handleError = () => {
      // If file doesn't exist, we set audioError but preserve UI functionality
      setAudioError(true)
      // Fallback duration is default from track
      setDuration(currentTrack?.duration || 5)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    // Cleanup
    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [autoNext])

  // Initialize ambient audio file if available
  useEffect(() => {
    ambientAudioRef.current = new Audio('/audio/ambient/campus-gate-loop.mp3')
    ambientAudioRef.current.loop = true
    ambientAudioRef.current.volume = ambientVolume

    // Clean up ambient audio on unmount
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause()
      }
    }
  }, [])

  // Sync volume & mute states
  useEffect(() => {
    if (dialogueAudioRef.current) {
      dialogueAudioRef.current.volume = isMuted ? 0 : dialogueVolume
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMuted ? 0 : ambientVolume
    }
    if (synthGainNodeRef.current && audioCtxRef.current) {
      const vol = isMuted ? 0 : ambientVolume
      synthGainNodeRef.current.gain.setValueAtTime(vol * 0.05, audioCtxRef.current.currentTime)
    }
  }, [dialogueVolume, ambientVolume, isMuted])

  // Track change listener
  useEffect(() => {
    if (!currentTrack) return

    // Stop current playing audio/synthesizer
    stopDialoguePlayback()

    // Setup new audio source
    setAudioError(false)
    setCurrentTime(0)
    setDuration(currentTrack.duration || 5)

    if (dialogueAudioRef.current) {
      dialogueAudioRef.current.src = currentTrack.audio
      dialogueAudioRef.current.load()
    }

    // If we were already playing, automatically resume
    if (isPlaying) {
      playDialogue()
    }
  }, [currentTrack])

  // Handle ambient synthesize start on first click/play
  const initAmbientSynth = () => {
    if (audioCtxRef.current) return

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContextClass()
      audioCtxRef.current = ctx

      const gainNode = ctx.createGain()
      const vol = isMuted ? 0 : ambientVolume
      gainNode.gain.setValueAtTime(vol * 0.05, ctx.currentTime) // Low-volume ambience
      gainNode.connect(ctx.destination)
      synthGainNodeRef.current = gainNode

      // Synthesize pink/brown wind noise
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
        output[i] *= 0.11 // rough scale
        b6 = white * 0.115926
      }

      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer
      noiseSource.loop = true

      // Filter for ambient rumble
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(250, ctx.currentTime)

      noiseSource.connect(filter)
      filter.connect(gainNode)
      noiseSource.start(0)

      synthSourceNodeRef.current = noiseSource
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e)
    }
  }

  // Play ambient audio file or start synthetic hum
  const playAmbient = () => {
    initAmbientSynth()
    
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }

    if (ambientAudioRef.current) {
      ambientAudioRef.current.play().catch(() => {
        // Silent catch: browsers block autoplay until interaction
      })
    }
  }

  // Stop playback cleanly
  const stopDialoguePlayback = () => {
    // Standard audio
    if (dialogueAudioRef.current) {
      dialogueAudioRef.current.pause()
    }

    // Fallback simulation
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current)
      fallbackIntervalRef.current = null
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    isFallbackPlayingRef.current = false
  }

  // Play dialogue track
  const playDialogue = () => {
    if (!currentTrack) return

    playAmbient()

    if (!audioError) {
      // Try playing local file
      dialogueAudioRef.current.play().catch((err) => {
        console.warn("Failed to play local audio file, launching SpeechSynthesis fallback:", err)
        setAudioError(true)
        startFallbackPlayback()
      })
    } else {
      startFallbackPlayback()
    }
    
    setIsPlaying(true)
  }

  // Start SpeechSynthesis + simulated progress timer
  const startFallbackPlayback = () => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current)
    }

    isFallbackPlayingRef.current = true
    const trackDuration = currentTrack?.duration || 5
    setDuration(trackDuration)
    
    // Speak using Web Speech API (fallback)
    if (window.speechSynthesis && !isMuted) {
      window.speechSynthesis.cancel()
      const textToSpeak = currentTrack.voiceText || currentTrack.dialogue
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      
      // Try to find a local Gujarati/Hindi or natural English voice if possible
      const voices = window.speechSynthesis.getVoices()
      const gujVoice = voices.find(v => v.lang.includes('gu') || v.lang.includes('GU'))
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'))
      
      if (gujVoice) {
        utterance.voice = gujVoice
        utterance.lang = 'gu-IN'
      } else if (hiVoice) {
        utterance.voice = hiVoice
        utterance.lang = 'hi-IN'
      } else {
        utterance.lang = 'en-IN' // Hinglish/Indian English feel
      }
      
      utterance.volume = dialogueVolume
      window.speechSynthesis.speak(utterance)
    }

    // Simulated progress bar interval (every 100ms)
    let elapsed = currentTime
    fallbackIntervalRef.current = setInterval(() => {
      elapsed += 0.1
      if (elapsed >= trackDuration) {
        clearInterval(fallbackIntervalRef.current)
        fallbackIntervalRef.current = null
        setCurrentTime(0)
        setIsPlaying(false)
        isFallbackPlayingRef.current = false
        if (autoNext && onTrackEndRef.current) {
          onTrackEndRef.current()
        }
      } else {
        setCurrentTime(elapsed)
      }
    }, 100)
  }

  const pauseDialogue = () => {
    stopDialoguePlayback()
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseDialogue()
    } else {
      playDialogue()
    }
  }

  const seek = (time) => {
    setCurrentTime(time)
    if (!audioError && dialogueAudioRef.current) {
      dialogueAudioRef.current.currentTime = time
    }
  }

  return {
    isPlaying,
    currentTime,
    duration,
    isMuted,
    dialogueVolume,
    ambientVolume,
    audioError,
    playDialogue,
    pauseDialogue,
    togglePlay,
    seek,
    setIsMuted,
    setDialogueVolume,
    setAmbientVolume,
    audioCtx: audioCtxRef.current
  }
}

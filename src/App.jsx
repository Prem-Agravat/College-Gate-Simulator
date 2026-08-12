import React, { useState, useEffect } from 'react'
import { studentTracks } from './data/studentTracks'
import { checkerTracks } from './data/checkerTracks'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useKeyboardControls } from './hooks/useKeyboardControls'

import SceneBackground from './components/SceneBackground'
import RoleSwitcher from './components/RoleSwitcher'
import SoundControl from './components/SoundControl'
import IDCardOverlay from './components/IDCardOverlay'
import AudioStoryPlayer from './components/AudioStoryPlayer'

import './styles/index.css'

export default function App() {
  const [role, setRole] = useState('student')
  const [trackIndex, setTrackIndex] = useState(0)
  const [autoNext, setAutoNext] = useState(true)

  // Get active track collection
  const tracks = role === 'student' ? studentTracks : checkerTracks
  const currentTrack = tracks[trackIndex]

  // Track end navigation handler
  const handleTrackEnd = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(prev => prev + 1)
    } else {
      setTrackIndex(0) // loop back to track 1
    }
  }

  // Audio Player Hook
  const {
    isPlaying,
    currentTime,
    duration,
    isMuted,
    dialogueVolume,
    ambientVolume,
    audioError,
    pauseDialogue,
    togglePlay,
    seek,
    setIsMuted,
    setDialogueVolume,
    setAmbientVolume
  } = useAudioPlayer(currentTrack, autoNext, handleTrackEnd)

  // Handlers for manual track change
  const handleNext = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(prev => prev + 1)
    } else {
      setTrackIndex(0)
    }
  }

  const handlePrev = () => {
    if (trackIndex > 0) {
      setTrackIndex(prev => prev - 1)
    } else {
      setTrackIndex(tracks.length - 1)
    }
  }

  const handleRoleChange = (newRole) => {
    if (newRole !== role) {
      pauseDialogue()
      setRole(newRole)
      setTrackIndex(0)
      seek(0)
    }
  }

  // Keyboard controls Hook
  useKeyboardControls(
    togglePlay,
    handleNext,
    handlePrev,
    () => setIsMuted(!isMuted)
  )

  // Calculate timeline synchronization steps for Checker Mode card inspection:
  // Step 0: 0.0s - 1.5s -> Student approaching
  // Step 1: 1.5s - 2.5s -> Student stops
  // Step 2: 2.5s - 3.5s -> Student raises and presents ID Card
  // Step 3: >= 3.5s     -> Security examines ID and Dialogue begins
  let timelineStep = 0
  if (role === 'checker') {
    if (currentTime >= 3.5) {
      timelineStep = 3
    } else if (currentTime >= 2.5) {
      timelineStep = 2
    } else if (currentTime >= 1.5) {
      timelineStep = 1
    }
  }

  // Setup auto-next defaulting on first play
  useEffect(() => {
    if (isPlaying) {
      // Keep autoNext on
    }
  }, [isPlaying])

  return (
    <div className="app-root-cinematic">
      {/* 1. Cinematic Background (Zoom & Crossfade) */}
      <SceneBackground track={currentTrack} isPlaying={isPlaying} />

      {/* 2. Top Header Navigation */}
      <header className="cinematic-header">
        <RoleSwitcher currentRole={role} onRoleChange={handleRoleChange} />
        
        <div className="cinematic-logo">
          <div className="uni-badge-star">★</div>
          <div className="uni-badge-text font-display">RK UNIVERSITY</div>
        </div>

        <SoundControl
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          dialogueVolume={dialogueVolume}
          onDialogueVolumeChange={setDialogueVolume}
          ambientVolume={ambientVolume}
          onAmbientVolumeChange={setAmbientVolume}
        />
      </header>

      {/* 3. Central Content Area */}
      <main className="cinematic-main">
        <div className="main-central-hero animate-fade-in">
          <h1 className="cinematic-title font-display">ID BATAVO</h1>
          <p className="cinematic-subtitle">
            {role === 'student' ? 'POV: Entering RK University Rajkot' : 'POV: Security Desk Checkpoint'}
          </p>

          {/* Dialogue Display with Typewriter Text Reveal */}
          <div className="cinematic-dialogue-panel">
            <span className="dialogue-speaker">{currentTrack.speaker}</span>
            <h2 className="dialogue-text-gujarati font-guj">
              {currentTrack.gujarati}
            </h2>
            <p className="dialogue-text-roman">
              {currentTrack.dialogue}
            </p>
            <p className="dialogue-scene-desc">
              {role === 'checker' && timelineStep < 2 
                ? (timelineStep === 0 ? "🚶 Student approaching checkpoint..." : "🧍 Student stops at the desk...") 
                : currentTrack.description}
            </p>
          </div>
        </div>

        {/* Checker Mode ID Card Overlay */}
        {role === 'checker' && (
          <div className="main-checker-inspect">
            <IDCardOverlay track={currentTrack} timelineStep={timelineStep} />
          </div>
        )}
      </main>

      {/* 4. Bottom Controls & Player */}
      <footer className="cinematic-footer">
        <AudioStoryPlayer
          track={currentTrack}
          trackNumber={trackIndex + 1}
          totalTracks={tracks.length}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          autoNext={autoNext}
          audioError={audioError}
          onTogglePlay={togglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={seek}
          onToggleAutoNext={() => setAutoNext(!autoNext)}
        />
        <div className="headphones-hint">
          <span>Use headphones for better experience 🎧</span>
        </div>
      </footer>
    </div>
  )
}

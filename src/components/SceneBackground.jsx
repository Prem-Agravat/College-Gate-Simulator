import React, { useState, useEffect } from 'react'

export default function SceneBackground({ track, isPlaying }) {
  const [currentTrack, setCurrentTrack] = useState(track)
  const [prevTrack, setPrevTrack] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (track.id !== currentTrack.id || track.speaker !== currentTrack.speaker) {
      setPrevTrack(currentTrack)
      setCurrentTrack(track)
      setIsTransitioning(true)

      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setPrevTrack(null)
      }, 1200) // matches CSS transition duration

      return () => clearTimeout(timer)
    }
  }, [track, currentTrack])

  return (
    <div className="scene-bg-container">
      {/* Background Dim Overlay */}
      <div className="scene-dim-overlay" />

      {/* Ambient Vignette for Cinematic Feel */}
      <div className="scene-vignette" />

      {/* Previous Scene Layer (Fading Out) */}
      {prevTrack && (
        <div 
          className={`scene-bg-layer fade-out ${prevTrack.zoomClass}`}
          style={{ backgroundImage: `url(${prevTrack.image})` }}
        />
      )}

      {/* Current Scene Layer (Fading In & Zooming) */}
      <div 
        className={`scene-bg-layer ${currentTrack.zoomClass} ${isTransitioning ? 'fade-in' : ''} ${isPlaying ? 'ken-burns-active' : ''}`}
        style={{ backgroundImage: `url(${currentTrack.image})` }}
      />
    </div>
  )
}

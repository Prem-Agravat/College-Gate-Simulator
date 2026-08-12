import React, { useState } from 'react'

export default function SoundControl({
  isMuted,
  onToggleMute,
  dialogueVolume,
  onDialogueVolumeChange,
  ambientVolume,
  onAmbientVolumeChange,
}) {
  const [showSliders, setShowSliders] = useState(false)

  return (
    <div
      className="sound-control-container"
      onMouseEnter={() => setShowSliders(true)}
      onMouseLeave={() => setShowSliders(false)}
    >
      <button
        onClick={onToggleMute}
        className={`sound-toggle-btn ${isMuted ? 'muted' : ''}`}
        aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        <span className="sound-icon">{isMuted ? '🔇' : '🔊'}</span>
      </button>

      {showSliders && (
        <div className="sound-sliders-dropdown">
          <div className="volume-slider-group">
            <div className="volume-slider-header">
              <span>Dialogue</span>
              <span>{Math.round(dialogueVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={dialogueVolume}
              onChange={(e) => onDialogueVolumeChange(parseFloat(e.target.value))}
              disabled={isMuted}
              className="volume-slider-input"
            />
          </div>

          <div className="volume-slider-group">
            <div className="volume-slider-header">
              <span>Ambience</span>
              <span>{Math.round(ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => onAmbientVolumeChange(parseFloat(e.target.value))}
              disabled={isMuted}
              className="volume-slider-input"
            />
          </div>
        </div>
      )}
    </div>
  )
}

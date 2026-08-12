import React from 'react'
import Waveform from './Waveform'

export default function AudioStoryPlayer({
  track,
  trackNumber,
  totalTracks,
  isPlaying,
  currentTime,
  duration,
  autoNext,
  audioError,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleAutoNext,
}) {
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e) => {
    onSeek(parseFloat(e.target.value))
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="audio-story-player-wrapper">
      <div className="audio-story-player-glass">
        {/* Left Section: Thumbnail */}
        <div className="player-left">
          <div className="player-thumbnail" style={{ backgroundImage: `url(${track.image})` }}>
            <div className="thumbnail-zoom-hint" />
          </div>
          <div className="player-track-info">
            <span className="player-track-counter">TRACK {trackNumber.toString().padStart(2, '0')} / {totalTracks.toString().padStart(2, '0')}</span>
            <h3 className="player-track-title">{track.title}</h3>
            <span className="player-track-speaker">{track.speaker}</span>
          </div>
        </div>

        {/* Center Section: Progress & Dialogue */}
        <div className="player-center">
          <div className="player-dialogue-preview">
            <span className="quote-mark">“</span>
            <span className="dialogue-preview-text">{track.dialogue.replace(/[“”"']/g, '')}</span>
            <span className="quote-mark">”</span>
          </div>

          <div className="player-progress-container">
            <span className="time-display font-mono">{formatTime(currentTime)}</span>
            <div className="progress-bar-slider-wrapper">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.05"
                value={currentTime}
                onChange={handleProgressChange}
                className="player-progress-slider"
                style={{
                  background: `linear-gradient(to right, var(--color-gold) 0%, var(--color-gold) ${progressPercent}%, rgba(255, 255, 255, 0.15) ${progressPercent}%, rgba(255, 255, 255, 0.15) 100%)`
                }}
              />
            </div>
            <span className="time-display font-mono">{formatTime(duration)}</span>
          </div>
          
          {audioError && (
            <div className="audio-unavailable-badge">
              ⚠️ Synth audio active (place voice MP3 in {track.audio})
            </div>
          )}
        </div>

        {/* Right Section: Controls & Waveform */}
        <div className="player-right">
          <div className="player-nav-controls">
            <button onClick={onPrev} className="player-control-btn prev-btn" aria-label="Previous Track">
              ⏮
            </button>
            <button 
              onClick={onTogglePlay} 
              className={`player-control-btn play-pause-btn ${isPlaying ? 'playing' : 'paused'}`} 
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="play-icon">{isPlaying ? '⏸' : '▶️'}</span>
            </button>
            <button onClick={onNext} className="player-control-btn next-btn" aria-label="Next Track">
              ⏭
            </button>
          </div>

          <div className="player-meta-controls">
            <button 
              onClick={onToggleAutoNext} 
              className={`auto-next-toggle-btn ${autoNext ? 'active' : ''}`}
            >
              AUTO NEXT: <span className="status-label">{autoNext ? 'ON' : 'OFF'}</span>
            </button>

            <Waveform isPlaying={isPlaying} />
          </div>
        </div>
      </div>
    </div>
  )
}

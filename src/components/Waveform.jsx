import React from 'react'

export default function Waveform({ isPlaying }) {
  // Create 20 equalizer bars
  const barsCount = 22
  const bars = Array.from({ length: barsCount })

  return (
    <div className={`waveform-container ${isPlaying ? 'playing' : 'paused'}`}>
      {bars.map((_, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            // Assign custom animation delays and heights to look natural and organic
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${0.6 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

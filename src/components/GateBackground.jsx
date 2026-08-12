import { useState, useEffect } from 'react'

export default function GateBackground() {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Reset state when mounting
    setError(false)
    setLoaded(false)
  }, [])

  return (
    <div className="gate-bg-wrapper">
      {!error && (
        <img
          src="/assets/rku-gate.jpg"
          alt="RK University Gate Background"
          className={`gate-bg-image ${loaded ? 'loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {error && (
        <div className="gate-bg-placeholder">
          <div className="placeholder-card">
            <div className="placeholder-header">
              <span className="placeholder-icon">📷</span>
              <h3>RK UNIVERSITY GATE PHOTO</h3>
            </div>
            <p className="placeholder-desc">
              Please place your high-quality campus gate photograph at:
            </p>
            <div className="placeholder-path">
              <code>public/assets/rku-gate.jpg</code>
            </div>
            <p className="placeholder-sub">
              The simulator will automatically load it as the background environment without any code changes.
            </p>
          </div>
        </div>
      )}
      {!loaded && !error && (
        <div className="gate-bg-loading">
          <div className="placeholder-spinner" />
          <p>Loading gate scene...</p>
        </div>
      )}
    </div>
  )
}

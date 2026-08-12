import React from 'react'

export default function IDCardOverlay({ track, timelineStep }) {
  if (!track || !track.idCard) {
    if (track?.flag === 'missing') {
      return (
        <div className="id-card-empty-state">
          <div className="empty-state-badge">⚠️ NO ID CARD PRESENTED</div>
          <p className="empty-state-text">Student forgot their physical ID card.</p>
        </div>
      )
    }
    return null
  }

  const { idCard, flag } = track
  const isPhone = flag === 'phone'
  
  // Highlight fields depending on track flag
  const isNameSuspicious = flag === 'name'
  const isPhotoSuspicious = flag === 'photo'
  const isValiditySuspicious = flag === 'validity'

  const cardContent = (
    <div className={`rk-id-card ${flag ? `flag-${flag}` : ''}`}>
      {/* Red vertical banner on left */}
      <div className="rk-id-stripe" />
      
      <div className="rk-id-header">
        <div className="rk-id-crest">⭐️</div>
        <div className="rk-id-branding">
          <h4 className="rk-id-uni">RK UNIVERSITY</h4>
          <span className="rk-id-location">RAJKOT, GUJARAT</span>
        </div>
      </div>

      <div className="rk-id-body">
        {/* Photo Box */}
        <div className={`rk-id-photo-box ${isPhotoSuspicious ? 'suspicious-glow' : ''}`}>
          <div className="rk-id-photo" style={{ backgroundColor: idCard.avatarColor }}>
            {isPhotoSuspicious ? '🤡' : idCard.avatar}
          </div>
          <span className="rk-id-photo-label">PHOTO ID</span>
        </div>

        {/* Details Table */}
        <div className="rk-id-meta">
          <div className={`rk-id-field ${isNameSuspicious ? 'suspicious-glow' : ''}`}>
            <span className="rk-id-label">NAME</span>
            <span className="rk-id-value">{idCard.name}</span>
          </div>

          <div className="rk-id-field">
            <span className="rk-id-label">COURSE</span>
            <span className="rk-id-value">{idCard.course}</span>
          </div>

          <div className="rk-id-row">
            <div className="rk-id-field">
              <span className="rk-id-label">SEM</span>
              <span className="rk-id-value">{idCard.semester}</span>
            </div>
            <div className="rk-id-field">
              <span className="rk-id-label">ID NO.</span>
              <span className="rk-id-value font-mono">{idCard.idNumber}</span>
            </div>
          </div>

          <div className={`rk-id-field ${isValiditySuspicious ? 'suspicious-glow' : ''}`}>
            <span className="rk-id-label">VALIDITY</span>
            <span className="rk-id-value val-badge">{idCard.validYears}</span>
          </div>
        </div>
      </div>

      {/* Suspicious warning note */}
      {flag !== 'none' && (
        <div className="rk-id-verification-tag">
          {isNameSuspicious && "⚠️ GENDER/NAME MISMATCH"}
          {isPhotoSuspicious && "⚠️ PHOTO DOES NOT MATCH STUDENT"}
          {isValiditySuspicious && "⚠️ EXPIRED CARD - OUT OF DATE"}
          {isPhone && "⚠️ DIGITAL SCREENSHOT NOT ALLOWED"}
        </div>
      )}
    </div>
  )

  if (isPhone) {
    return (
      <div className="phone-mockup-wrapper animate-slide-in">
        <div className="phone-bezel">
          <div className="phone-camera-notch" />
          <div className="phone-screen">
            <div className="phone-status-bar">
              <span>RK-Cell</span>
              <span>19:47</span>
              <span>🔋 84%</span>
            </div>
            <div className="phone-app-header">
              <span>My RK-ID Wallet</span>
            </div>
            <div className="phone-card-container">
              {cardContent}
            </div>
            <div className="phone-home-indicator" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`id-card-wrapper animate-slide-in ${timelineStep >= 2 ? 'presented' : 'hidden-view'}`}>
      {cardContent}
    </div>
  )
}

export default function SecurityGuard({ pose = 'idle' }) {
  return (
    <div className={`character security-char pose-${pose}`} aria-hidden="true">
      <div className="char-shadow" />
      <div className="security-desk">
        <div className="desk-top" />
        <div className="desk-bottle" title="Water bottle" />
        <div className="desk-paper" title="Register" />
      </div>
      <div className="char-body">
        <div className="char-head">
          <div className="char-cap" />
          <div className="char-face" />
          {pose === 'sleep' && <div className="zzz">z</div>}
        </div>
        <div className="char-torso security-torso" />
        {pose === 'drink' && <div className="chai-cup" />}
        {pose === 'phone' && <div className="hand-phone" />}
        {pose === 'newspaper' && <div className="newspaper-prop" />}
        <div className="char-legs">
          <span className={`leg left ${pose === 'music' ? 'tap' : ''}`} />
          <span className={`leg right ${pose === 'music' ? 'tap' : ''}`} />
        </div>
      </div>
      <span className="char-label">Security</span>
    </div>
  )
}

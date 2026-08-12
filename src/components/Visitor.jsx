export default function Visitor({ pose = 'idle', label = 'Visitor' }) {
  return (
    <div className={`character visitor-char pose-${pose}`} aria-hidden="true">
      <div className="char-shadow" />
      <div className="char-body">
        <div className="char-head">
          <div className="char-hair visitor-hair" />
          <div className="char-face" />
        </div>
        <div className="char-torso visitor-torso" />
        <div className="char-legs">
          <span className="leg left" />
          <span className="leg right" />
        </div>
      </div>
      <span className="char-label">{label}</span>
    </div>
  )
}

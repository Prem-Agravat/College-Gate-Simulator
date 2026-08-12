export default function Student({ pose = 'idle', label = 'You', highlight = false }) {
  return (
    <div
      className={`character student-char pose-${pose} ${highlight ? 'character--highlight' : ''}`}
      aria-hidden="true"
    >
      <div className="char-shadow" />
      <div className="char-body">
        <div className="char-head">
          <div className="char-hair" />
          <div className="char-face" />
        </div>
        <div className="char-torso student-torso" />
        <div className="char-bag" />
        <div className="char-legs">
          <span className="leg left" />
          <span className="leg right" />
        </div>
      </div>
      {label && <span className="char-label">{label}</span>}
    </div>
  )
}

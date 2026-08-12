export default function Professor({ pose = 'walk', name = 'Professor' }) {
  return (
    <div className={`character professor-char pose-${pose}`} aria-hidden="true">
      <div className="char-shadow" />
      <div className="char-body">
        <div className="char-head">
          <div className="char-hair professor-hair" />
          <div className="char-face" />
        </div>
        <div className="char-torso professor-torso" />
        <div className="char-legs">
          <span className="leg left" />
          <span className="leg right" />
        </div>
      </div>
      <span className="char-label">{name}</span>
    </div>
  )
}

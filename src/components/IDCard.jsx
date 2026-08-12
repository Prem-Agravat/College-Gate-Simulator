export default function IDCard({
  name,
  college,
  course,
  semester,
  studentId,
  photo,
  photoColor = '#c4a574',
  validYear = '2026-27',
  variant = 'student',
  flying = false,
  inspecting = false,
  upsideDown = false,
  issue,
  holderName,
  compact = false,
}) {
  return (
    <article
      className={[
        'id-card',
        `id-card--${variant}`,
        flying ? 'id-card--fly' : '',
        inspecting ? 'id-card--inspect' : '',
        upsideDown ? 'id-card--upside' : '',
        compact ? 'id-card--compact' : '',
        issue ? `id-card--issue-${issue}` : '',
      ].filter(Boolean).join(' ')}
      aria-label={`College ID for ${name}`}
    >
      <header className="id-card__header">
        <div className="id-card__crest" aria-hidden="true" />
        <div>
          <p className="id-card__college">{college || 'COLLEGE'}</p>
          <p className="id-card__type">{variant === 'visitor' ? 'VISITOR PASS' : 'STUDENT IDENTITY CARD'}</p>
        </div>
      </header>
      <div className="id-card__body">
        <div
          className="id-card__photo"
          style={photo ? { backgroundImage: `url(${photo})` } : { background: photoColor }}
        >
          {!photo && <span className="id-card__photo-fallback">{(name || '?').slice(0, 1)}</span>}
        </div>
        <div className="id-card__meta">
          <h3 className="id-card__name">{holderName || name}</h3>
          <p>{course}</p>
          {semester != null && <p>Semester {semester}</p>}
          {studentId && <p className="id-card__id">ID: {studentId}</p>}
          <p className="id-card__valid">VALID: {validYear}</p>
        </div>
      </div>
      {issue && issue !== 'missing_id' && (
        <p className="id-card__hint" aria-hidden="true">Inspect carefully…</p>
      )}
    </article>
  )
}

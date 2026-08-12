const ROLES = [
  {
    id: 'student',
    emoji: '👨‍🎓',
    title: 'STUDENT',
    blurb: 'Try to enter RK University.',
    preview: 'walk',
  },
  {
    id: 'checker',
    emoji: '🛂',
    title: 'ID CHECKER',
    blurb: "Check every student's ID.",
    preview: 'check',
  },
  {
    id: 'free',
    emoji: '🎧',
    title: 'SECURITY FREE TIME',
    blurb: 'Gate is quiet. Time to chill.',
    preview: 'chill',
  },
  {
    id: 'professor',
    emoji: '👨‍🏫',
    title: 'PROFESSOR',
    blurb: 'Walk through the gate.',
    preview: 'prof',
  },
  {
    id: 'visitor',
    emoji: '🚶',
    title: 'VISITOR',
    blurb: 'Try to enter the campus.',
    preview: 'visit',
  },
]

export default function RoleSelector({ onSelect }) {
  return (
    <section className="role-selector" aria-labelledby="role-heading">
      <p className="role-kicker">COLLEGE GATE</p>
      <h1 id="role-heading">WHO ARE YOU TODAY?</h1>
      <div className="role-grid">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`role-card preview-${r.preview}`}
            onClick={() => onSelect(r.id)}
          >
            <span className="role-preview" aria-hidden="true">
              <span className="preview-figure" />
            </span>
            <span className="role-emoji" aria-hidden="true">{r.emoji}</span>
            <span className="role-title">{r.title}</span>
            <span className="role-blurb">{r.blurb}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

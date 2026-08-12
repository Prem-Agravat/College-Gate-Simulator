export default function DialogueBox({ dialogue }) {
  if (!dialogue?.text) return null
  const speaker = dialogue.speaker || 'narrator'
  return (
    <div className="dialogue-box" role="status" aria-live="polite">
      <span className={`dialogue-speaker speaker-${speaker}`}>{labelFor(speaker)}</span>
      <p className="dialogue-text">{dialogue.text}</p>
    </div>
  )
}

function labelFor(speaker) {
  const map = {
    security: 'SECURITY',
    student: 'STUDENT',
    professor: 'PROFESSOR',
    visitor: 'VISITOR',
    chaiwala: 'CHAIWALA',
    narrator: 'SCENE',
    npc: 'SOMEONE',
  }
  return map[speaker] || speaker.toUpperCase()
}

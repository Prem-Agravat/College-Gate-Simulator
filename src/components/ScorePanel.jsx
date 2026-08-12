export default function ScorePanel({ role, stats, timeLabel, periodLabel }) {
  if (role !== 'checker' && role !== 'free') {
    return (
      <div className="score-panel score-panel--minimal" aria-live="polite">
        <span className="time-chip">{timeLabel}</span>
        <span className="period-chip">{periodLabel}</span>
      </div>
    )
  }

  return (
    <div className="score-panel" aria-live="polite">
      <span className="time-chip">{timeLabel}</span>
      <ul>
        <li>Checked: {stats.studentsChecked}</li>
        <li>OK: {stats.approved}</li>
        <li>Stop: {stats.rejected}</li>
        <li>Mistakes: {stats.mistakes}</li>
        <li className="score-strong">Score: {stats.securityScore}</li>
      </ul>
    </div>
  )
}

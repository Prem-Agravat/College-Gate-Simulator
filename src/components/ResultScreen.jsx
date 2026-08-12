import { useRef } from 'react'

export default function ResultScreen({ result, onPlayAgain, onChangeRole }) {
  const cardRef = useRef(null)

  const share = async () => {
    const text = `${result.name}\n${result.scoreLabel}: ${result.score}/100\n${result.blurb}\n\nID BATAVO — College Gate Simulator`
    if (navigator.share) {
      try {
        await navigator.share({ title: result.name, text })
        return
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      alert('Result copied to clipboard!')
    } catch {
      alert(text)
    }
  }

  const downloadCard = () => {
    const node = cardRef.current
    if (!node) return
    // Simple share-ready export as text file (no canvas dependency)
    const blob = new Blob(
      [`${result.name}\n${result.title}\n${result.scoreLabel}: ${result.score}/100\n${result.blurb}\n`],
      { type: 'text/plain' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'id-batavo-result.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!result) return null

  return (
    <section className="result-screen" aria-labelledby="result-title">
      <div className="result-card" ref={cardRef}>
        <p className="result-kicker">YOUR COLLEGE DAY</p>
        <h1 id="result-title">{result.name}</h1>
        <h2>{result.title}</h2>
        <ul>
          {result.lines.map((l) => (
            <li key={l.label}>
              <span>{l.label}</span>
              <strong>{l.value}</strong>
            </li>
          ))}
        </ul>
        <p className="result-score">
          {result.scoreLabel}: <strong>{result.score}/100</strong>
        </p>
        <p className="result-blurb">{result.blurb}</p>
      </div>
      <div className="result-actions">
        <button type="button" className="primary-btn" onClick={onPlayAgain}>PLAY AGAIN</button>
        <button type="button" onClick={onChangeRole}>CHANGE ROLE</button>
        <button type="button" onClick={share}>SHARE MY RESULT</button>
        <button type="button" className="ghost" onClick={downloadCard}>DOWNLOAD CARD</button>
      </div>
    </section>
  )
}

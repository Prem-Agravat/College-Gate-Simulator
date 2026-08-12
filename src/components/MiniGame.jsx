import { useState } from 'react'

/** Tiny tap game — keep the gate clear */
export default function MiniGame({ onClose }) {
  const [score, setScore] = useState(0)
  const [msg, setMsg] = useState('Tap when a student peeks!')

  return (
    <div className="minigame" role="dialog" aria-label="Gate mini game">
      <h3>GATE WATCH</h3>
      <p>{msg}</p>
      <p className="minigame-score">Score: {score}</p>
      <button
        type="button"
        className="minigame-tap"
        onClick={() => {
          setScore((s) => s + 1)
          setMsg(['Caught!', 'ID બતાવો!', 'રોકો!', 'Nice catch'][score % 4])
        }}
      >
        👀 TAP
      </button>
      <button type="button" className="overlay-close" onClick={onClose}>Close</button>
    </div>
  )
}

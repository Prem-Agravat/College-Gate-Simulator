import { useState } from 'react'

const APPS = [
  { id: 'wa', name: 'WhatsApp', icon: '💬' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'calc', name: 'Calculator', icon: '🧮' },
  { id: 'gallery', name: 'Gallery', icon: '🖼' },
  { id: 'weather', name: 'Weather', icon: '🌤' },
  { id: 'calls', name: 'Calls', icon: '📞' },
]

const NOTIFS = [
  { from: 'Principal', text: 'Gate properly check કરજો.' },
  { from: 'Chaiwala', text: '2 cutting?' },
  { from: 'Unknown', text: 'Bhai attendance ketli che?' },
  { from: 'Wife', text: 'ક્યારે છૂટશો?' },
  { from: 'College Group', text: 'ID compulsory tomorrow' },
]

export default function Phone({ onClose, onOpenMusic }) {
  const [app, setApp] = useState(null)

  return (
    <div className="phone-shell" role="dialog" aria-label="Security phone">
      <div className="phone-notch" />
      {!app && (
        <>
          <div className="phone-status">10:43 · Security</div>
          <div className="phone-notifs">
            {NOTIFS.map((n) => (
              <div key={n.from} className="phone-notif">
                <strong>{n.from}</strong>
                <span>{n.text}</span>
              </div>
            ))}
          </div>
          <div className="phone-grid">
            {APPS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="phone-app"
                onClick={() => {
                  if (a.id === 'music') onOpenMusic?.()
                  else setApp(a.id)
                }}
              >
                <span>{a.icon}</span>
                {a.name}
              </button>
            ))}
          </div>
        </>
      )}
      {app === 'wa' && (
        <div className="phone-app-view">
          <button type="button" onClick={() => setApp(null)}>←</button>
          <h3>WhatsApp</h3>
          {NOTIFS.map((n) => (
            <p key={n.from}><strong>{n.from}:</strong> {n.text}</p>
          ))}
        </div>
      )}
      {app === 'calc' && (
        <div className="phone-app-view">
          <button type="button" onClick={() => setApp(null)}>←</button>
          <h3>Calculator</h3>
          <p className="calc-screen">Students today = ∞</p>
        </div>
      )}
      {app === 'gallery' && (
        <div className="phone-app-view">
          <button type="button" onClick={() => setApp(null)}>←</button>
          <h3>Gallery</h3>
          <p>Gate selfies · Chai steam · Empty road at 2 PM</p>
        </div>
      )}
      {app === 'weather' && (
        <div className="phone-app-view">
          <button type="button" onClick={() => setApp(null)}>←</button>
          <h3>Weather</h3>
          <p>Rajkot · 34° · Sunny · Perfect for gate duty</p>
        </div>
      )}
      {app === 'calls' && (
        <div className="phone-app-view">
          <button type="button" onClick={() => setApp(null)}>←</button>
          <h3>Recent</h3>
          <p>Missed: Principal (2)</p>
          <p>Chaiwala</p>
        </div>
      )}
      <button type="button" className="phone-close" onClick={onClose} aria-label="Close phone">Close</button>
    </div>
  )
}

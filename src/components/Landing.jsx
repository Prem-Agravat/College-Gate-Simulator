import GateBackground from './GateBackground'

export default function Landing({ onEnter }) {
  return (
    <section className="landing" aria-labelledby="landing-title">
      <GateBackground />
      
      {/* Subtle ambient movements layered over the gate photo */}
      <div className="landing-ambient" aria-hidden="true">
        <div className="landing-trees">
          <span className="ltree lt1" />
          <span className="ltree lt2" />
        </div>
        <div className="landing-guard">
          <div className="lguard-chair" />
          <div className="lguard-body" />
        </div>
        <div className="landing-walkers">
          <div className="lwalker lw1" />
          <div className="lwalker lw2" />
        </div>
        <div className="landing-traffic">
          <div className="lcycle" />
        </div>
      </div>

      <div className="landing-copy">
        <p className="brand">RK UNIVERSITY</p>
        <h1 id="landing-title">
          ID BATAVO
        </h1>
        <p className="subtitle">POV: You are entering RK University.</p>
        <button type="button" className="primary-btn enter-btn" onClick={onEnter}>
          ENTER CAMPUS
        </button>
      </div>
    </section>
  )
}


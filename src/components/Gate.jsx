export default function Gate({ open }) {
  return (
    <div className={`gate ${open ? 'gate--open' : ''}`} aria-hidden="true">
      <div className="gate__pillar gate__pillar--left" />
      <div className="gate__barrier">
        <div className="gate__arm" />
        <div className="gate__hinge" />
      </div>
      <div className="gate__pillar gate__pillar--right" />
      <div className="gate__sign">GATE</div>
    </div>
  )
}

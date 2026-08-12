export default function ChaiInteraction({ onOrder, onClose }) {
  return (
    <div className="chai-panel" role="dialog" aria-label="Chai order">
      <p className="chai-line">ચા મૂકી દઉં?</p>
      <div className="action-row">
        <button type="button" onClick={() => onOrder('cutting')}>CUTTING</button>
        <button type="button" onClick={() => onOrder('full')}>FULL</button>
        <button type="button" className="ghost" onClick={() => onOrder('no')}>NO CHAI</button>
      </div>
      <button type="button" className="overlay-close" onClick={onClose}>Close</button>
    </div>
  )
}

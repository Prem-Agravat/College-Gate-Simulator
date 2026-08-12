export default function ControlPanel({
  soundOn,
  onToggleSound,
  onSettings,
  onChangeRole,
  paused,
  onTogglePause,
  volume,
  onVolume,
  settingsOpen,
}) {
  return (
    <div className="control-panel" role="toolbar" aria-label="Global controls">
      <button type="button" className="ctrl-btn" onClick={onToggleSound} aria-pressed={soundOn} aria-label="Toggle sound">
        {soundOn ? '🔊' : '🔇'}
      </button>
      <button type="button" className="ctrl-btn" onClick={onSettings} aria-expanded={settingsOpen} aria-label="Settings">
        ⚙
      </button>
      <button type="button" className="ctrl-btn" onClick={onChangeRole} aria-label="Change role">
        ↩
      </button>
      <button type="button" className="ctrl-btn" onClick={onTogglePause} aria-pressed={paused} aria-label={paused ? 'Resume' : 'Pause'}>
        {paused ? '▶' : '⏸'}
      </button>
      {settingsOpen && (
        <div className="settings-popover" role="dialog" aria-label="Settings">
          <label>
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolume(Number(e.target.value))}
            />
          </label>
          <p className="settings-hint">Sound starts after ENTER. Drop files in /public/audio/</p>
        </div>
      )}
    </div>
  )
}

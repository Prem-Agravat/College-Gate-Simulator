export default function MusicPlayer({ track, playing, onPlay, onPause, onNext, onClose, playlist }) {
  return (
    <div className="music-player" role="dialog" aria-label="Security Bhai Playlist">
      <h3>SECURITY BHAI PLAYLIST</h3>
      <p className="music-now">{track?.title}</p>
      <p className="music-artist">{track?.artist}</p>
      <div className="music-controls">
        <button type="button" onClick={playing ? onPause : onPlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button type="button" onClick={onNext} aria-label="Next song">⏭</button>
      </div>
      <ul className="music-list">
        {playlist.map((t) => (
          <li key={t.id} className={t.id === track?.id ? 'active' : ''}>{t.title}</li>
        ))}
      </ul>
      <button type="button" className="overlay-close" onClick={onClose}>Close</button>
    </div>
  )
}

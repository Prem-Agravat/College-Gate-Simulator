import { useEffect } from 'react'

export function useKeyboardControls(onTogglePlay, onNextTrack, onPrevTrack, onToggleMute) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is typing in an input/textarea
      const activeEl = document.activeElement
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable)
      ) {
        return
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          onTogglePlay()
          break
        case 'ArrowRight':
          event.preventDefault()
          onNextTrack()
          break
        case 'ArrowLeft':
          event.preventDefault()
          onPrevTrack()
          break
        case 'KeyM':
          event.preventDefault()
          onToggleMute()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onTogglePlay, onNextTrack, onPrevTrack, onToggleMute])
}

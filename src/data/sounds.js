/**
 * Sound catalog — point these at files under /public/audio/
 * Missing files fall back to Web Audio synthesis in useAudio.
 */
export const SOUNDS = {
  ambient: {
    campus: '/audio/ambient/campus-morning.mp3',
    birds: '/audio/ambient/birds.mp3',
    crowd: '/audio/ambient/distant-crowd.mp3',
  },
  effects: {
    footsteps: '/audio/effects/footsteps.mp3',
    gateOpen: '/audio/effects/gate-open.mp3',
    gateClose: '/audio/effects/gate-close.mp3',
    horn: '/audio/effects/horn.mp3',
    phone: '/audio/effects/phone-buzz.mp3',
    chai: '/audio/effects/chai-pour.mp3',
    bell: '/audio/effects/bell.mp3',
    notification: '/audio/effects/notification.mp3',
  },
}

export const SOUND_CATEGORIES = [
  'ambient',
  'dialogue',
  'horn',
  'footsteps',
  'gate',
  'phone',
  'chai',
  'music',
  'notification',
]

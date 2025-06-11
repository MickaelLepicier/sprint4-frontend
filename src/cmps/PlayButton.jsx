// *** ICONS ***
// import play from '../assets/icons/media-player/play_small.svg'
// import pause from '../assets/icons/media-player/pause_small.svg'

import play from '../assets/icons/media-player/mp_play.svg'
import pause from '../assets/icons/media-player/mp_pause.svg'

import { SetActionBtn } from './util/SetActionBtn'

export function PlayButton({ isPlaying, onToggle, addClassName = '' }) {
  
  const className = isPlaying ? `pause ${addClassName}` : `play ${addClassName}`
  const imgSrc = isPlaying ? pause : play

  return <SetActionBtn imgSrc={imgSrc} str={className} onClick={onToggle} />
}

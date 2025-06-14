// *** ICONS ***
// import play from '../assets/icons/media-player/play_small.svg'
// import pause from '../assets/icons/media-player/pause_small.svg'

import play from '../assets/icons/media-player/mp_play.svg'
import pause from '../assets/icons/media-player/mp_pause.svg'

import { SetActionBtn } from './util/SetActionBtn'
import { PlayIcon } from './svg/PlayIcon'
import { PauseIcon } from './svg/PauseIcon'

export function PlayButton({ isPlaying, onToggle, className = '' }) {
  // const className = isPlaying ? `pause ${addClassName}` : `play ${addClassName}`
  // const imgSrc = isPlaying ? pause : play

  // return <SetActionBtn imgSrc={imgSrc} str={className} onClick={onToggle} />

  const currIcon = isPlaying ? <PauseIcon className={className} /> : <PlayIcon className={className} />
  return (
    <section className="img-wrapper" onClick={onToggle}>
      {currIcon}
    </section>
  )
}

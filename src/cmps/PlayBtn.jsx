// *** ICONS ***
// import play from '../assets/icons/media-player/play_small.svg'
// import pause from '../assets/icons/media-player/pause_small.svg'

import { SetActionBtn } from './util/SetActionBtn'
import { PlayIcon } from './svg/PlayIcon'
import { PauseIcon } from './svg/PauseIcon'

// TODOs:
// [] className is for the ICON width and height
// [] addClassName is fot the BUTTON width and height
// []
// []

// SIZEs:
// song-preview-play-icon :
// song-preview-pause-icon :

export function PlayBtn({ isPlaying, onToggle, className = '' }) {
  // const btnSize = getBtnSize(iconSize)
  const btnSize = className.replace(/-icon/, '-btn')
  console.log('btnSize: ', btnSize)

  const viewBox = getViewBox(className)
  const path = getPath(className)
  const currIcon = getIcon(isPlaying, className, viewBox, path)

  // console.log('iconSize: ',iconSize)
  // console.log('btnSize: ',btnSize)

  return <SetActionBtn currIcon={currIcon} addClassName={btnSize} onClick={onToggle} />
}

// function getBtnSize(iconSize) {

// }

function getViewBox(iconSize) {
  if (iconSize.includes('songlist')) {
    return '0 0 24 24'
  }

  if (iconSize.includes('song-preview')) {
    return '0 0 24 24'
  }

  // track-control
  return '0 0 16 16'


  // "0 0 32 32"
  // "0 0 48 48"
}

function getPath(iconSize) {
  /* track-control */
  if (iconSize.includes('track-control-play')) {
    return 'M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z'
  }

  if (iconSize.includes('track-control-pause')) {
    return "M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"
  }

  /* songlist */
  if (iconSize.includes('songlist-play') || iconSize.includes('preview-play')) {
    return "m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"
  }
  if (iconSize.includes('songlist-pause') || iconSize.includes('preview-pause')) {
    return "M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z"
  }

  /* preview song */
  // if (iconSize.includes('songlist-play')) {
  //   return "m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"
  // }
  // if (iconSize.includes('songlist-pause')) {
  //   return "M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z"
  // }



  //  if(iconSize.includes('song-preview')){
  //   return "0 0 24 24"
  // }
}

function getIcon(isPlaying, className, viewBox, path) {
  // console.log('viewBox: ',viewBox)
  // add path ->
  return isPlaying ? (
    <PauseIcon className={className} viewBox={viewBox} path={path} />
  ) : (
    <PlayIcon className={className} viewBox={viewBox} path={path} />
  )
}

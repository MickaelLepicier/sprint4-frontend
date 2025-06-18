import { SetActionBtn } from './util/SetActionBtn'
import { PlayIcon } from './svg/PlayIcon'
import { PauseIcon } from './svg/PauseIcon'

export function PlayBtn({ isPlaying, onToggle, className = '' }) {
  // const btnSize = getBtnSize(iconSize)
  const btnSize = className.replace(/-icon/, '-btn')

  const viewBox = getViewBox(className)
  const path = getPath(className)
  const currIcon = getIcon(isPlaying, className, viewBox, path)

  return <SetActionBtn currIcon={currIcon} addClassName={btnSize} onClick={onToggle} />
}

function getViewBox(cn) {
  if (cn.includes('songlist')) {
    return '0 0 24 24'
  }

  if (cn.includes('song-preview')) {
    return '0 0 24 24'
  }

  // track-control
  return '0 0 16 16'

  // "0 0 32 32"
  // "0 0 48 48"
}

function getPath(cn) {
  /* track-control */
  if (cn.includes('track-control-play')) {
    return <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z" />
  }

  if (cn.includes('track-control-pause')) {
    return (
      <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z" />
    )
  }

  /* songlist || preview song*/
  if (cn.includes('songlist-play') || cn.includes('preview-play')) {
    return (
      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606" />
    )
  }
  if (cn.includes('songlist-pause') || cn.includes('preview-pause')) {
    return (
      <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z" />
    )
  }
}

function getIcon(isPlaying, cn, viewBox, path) {
  return isPlaying ? (
    <PauseIcon className={cn} viewBox={viewBox} path={path} />
  ) : (
    <PlayIcon className={cn} viewBox={viewBox} path={path} />
  )
}

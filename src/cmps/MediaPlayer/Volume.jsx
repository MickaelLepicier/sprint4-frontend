import { SetTrackBtn } from '../SetTrackBtn'

export function Volume({ volume, toggleMute, handleVolumeChange }) {
 
  function getVolumeClassName() {
    let className = 'volume-high'

    if (volume === 0) className = 'volume-mute'
    else if (volume <= 40) className = 'volume-low'
    else if (volume <= 80) className = 'volume-meduim'

    return className
  }

  return (
    <section className="track-options flex">

      <SetTrackBtn className={getVolumeClassName()} onClick={toggleMute} />

      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="track-bar"
        style={{ '--bar-fill': `${volume}%` }}
      />
    </section>
  )
}

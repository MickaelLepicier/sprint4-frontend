

import volumeLow from '../../assets/icons/media-player/volume_low.svg'
import volumeMedium from '../../assets/icons/media-player/volume_medium.svg'
import volumeHigh from '../../assets/icons/media-player/volume_high.svg'
import volumeMute from '../../assets/icons/media-player/volume_mute.svg'


export function Volume({volume, toggleMute, handleVolumeChange}){
    
    function getVolumeIcon() {
        let imgSrc = volumeHigh
    
        if (volume === 0) imgSrc = volumeMute
        else if (volume <= 40) imgSrc = volumeLow
        else if (volume <= 80) imgSrc = volumeMedium
    
        return <img src={imgSrc} alt="volume icon" />
      }
    
    return (<section className="track-options flex">
    <button className="track-action" onClick={toggleMute}>
      <span>{getVolumeIcon()}</span>
    </button>

    <input
      type="range"
      min="0"
      max="100"
      value={volume}
      onChange={handleVolumeChange}
      className="track-bar"
      style={{ '--bar-fill': `${volume}%` }}
    />
  </section>)
}
import { useState } from 'react'
import { LyricsBtn } from './LyricsBtn'
import { Volume } from './Volume'

export function TrackExtras({ volume, setVolume, isDisabled }) {
  const [prevVolume, setPrevVolume] = useState(50)

  function handleVolumeChange(ev) {
    const newVolume = +ev.target.value

    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }

  function toggleMute() {
    if (volume === 0) {
      setVolume(prevVolume)
      if (playerRef.current) playerRef.current.setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      if (playerRef.current) playerRef.current.setVolume(0)
    }
  }

  return (
    <section className="other-options flex align-center">
      <LyricsBtn isDisabled={isDisabled}/>

      <Volume
        volume={volume}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
        isDisabled={isDisabled}
      />
    </section>
  )
}

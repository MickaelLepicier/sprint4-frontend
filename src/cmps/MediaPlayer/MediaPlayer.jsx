import { useSelector } from 'react-redux'
import { useState } from 'react'

import { Volume } from '../MediaPlayer/Volume.jsx'
import { SongInfo } from '../MediaPlayer/SongInfo.jsx'
import { TrackControl } from './TrackControl.jsx'

export function MediaPlayer() {
  const currSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  )

  console.log('### MediaPlayer ###')
  // volume
  const [volume, setVolume] = useState(50)
  const [prevVolume, setPrevVolume] = useState(50)

  // *** VOLUME ***

  function handleVolumeChange(ev) {
    const newVolume = +ev.target.value

    // TODO - add debounce 0.5 sec to this, to render less
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
    <section className="media-player-container flex align-center">
      <SongInfo song={currSong} />

      <TrackControl currSong={currSong} volume={volume} />

      <Volume
        volume={volume}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
      />
    </section>
  )
}

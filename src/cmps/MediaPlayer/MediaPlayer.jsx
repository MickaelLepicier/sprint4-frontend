import { useSelector } from 'react-redux'
import { useState } from 'react'

import { TrackInfo } from './TrackInfo.jsx'
import { TrackControl } from './TrackControl.jsx'
import { TrackExtras } from './TrackExtras.jsx'

export function MediaPlayer() {
  const currSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  )

  const [volume, setVolume] = useState(50)

  const isDisabled = currSong
    ? {}
    : {
        opacity: 0.5,
        pointerEvents: 'none',
        cursor: 'not-allowed',
        userSelect: 'none'
      }

  // const isDisable = song ? {} : { userSelect: 'none' };

  return (
    <section className="media-player-container flex align-center">
      <TrackInfo song={currSong} isDisabled={isDisabled} />

      <TrackControl currSong={currSong} volume={volume} />

      <TrackExtras
        volume={volume}
        setVolume={setVolume}
        isDisabled={isDisabled}
      />
    </section>
  )
}

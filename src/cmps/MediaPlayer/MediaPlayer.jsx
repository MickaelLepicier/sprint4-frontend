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

  return (
    <section className="media-player-container flex align-center">
      <TrackInfo song={currSong} />

      <TrackControl currSong={currSong} volume={volume} />

      <TrackExtras volume={volume} setVolume={setVolume} />
    </section>
  )
}

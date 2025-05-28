import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStation, addStationMsg } from '../store/station/station.actions'

export function PlayList() {
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    loadStation(stationId)
  }, [stationId])

  // async function onAddStationMsg(stationId) {
  //     try {
  //         await addStationMsg(stationId, 'bla bla ' + parseInt(Math.random() * 10))
  //         showSuccessMsg(`Station msg added`)
  //     } catch (err) {
  //         showErrorMsg('Cannot add station msg')
  //     }

  // }
  if (!station) return <div>Loading playlist...</div>

  const songs = station?.songs || []

  return (
    <section className="station-play-list">
      <header className="station-header"></header>
      <div className="playlist-play-actions">
        <button>PLAY SECTION</button>
        <button>Compact</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Album</th>
            <th>Date Added</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, idx) => (
            <tr key={song._id}>
              <td>{idx + 1}</td>
              <td>{song.title}</td>
              <td>{station.name}</td>
              <td>{new Date(song.addedAt).toLocaleDateString()}</td>
              <td>⏱️</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <button onClick={() => { onAddStationMsg(station._id) }}>Add station msg</button> */}
    </section>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStation, addStationMsg } from '../store/station/station.actions'
import { SET_IS_PLAYING, SET_SONG } from '../store/station/station.reducer'

export function PlayList() {
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  const [isCompact, setIsCompact] = useState(false)
  const [currSong, setCurrSong] = useState(null)

  const isPlaying = useSelector(storeState => storeState.stationModule.isPlaying)

  const dispatch = useDispatch()

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

  function onPlaySong(song) {
    setCurrSong(song)

    dispatch({ type: SET_SONG, song })
    dispatch({ type: SET_IS_PLAYING, isPlaying })
  }

  if (!station) return <div>Loading playlist...</div>

  const songs = station?.songs || []

  return (
    <section className="station-play-list">
      <header className="station-header">
        <img src={station.imgUrl} alt="" />
        <h1>{station.name}</h1>
      </header>
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
            <tr key={song._id} className="song-row">
              <td className="song-play-idx">
                <span className="song-idx">{idx + 1}</span>
                <span
                  className="play-icon"
                  onClick={() => {
                    onPlaySong(song)
                  }}
                >
                  ▶
                </span>
              </td>
              <td>
                <div className="song-img-title">
                  <img src={song.imgUrl} alt="img" style={{ width: 40 + 'px', height: 40 + 'px' }} />
                  <p>{song.title}</p>
                </div>
              </td>
              <td>{station.name}</td>
              <td>{new Date(song.addedAt).toLocaleDateString()}</td>

              <td>
                <button className="add-to-liked">+</button>
                <span className="song-duration">⏱️ </span>
                <button className="more-options">...</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <button onClick={() => { onAddStationMsg(station._id) }}>Add station msg</button> */}
    </section>
  )
}

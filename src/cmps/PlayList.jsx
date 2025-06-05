import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import {
  loadStation,
  addStationMsg,
  setSong,
  setIsPlaying,
  togglePlay
} from '../store/station/station.actions'
import { SongSearchResult } from './SongSearchResult'
import { loadSearchResults } from '../store/search/search.actions'
import { debounce } from '../services/util.service'
import { PlayButton } from './PlayButton'

export function PlayList() {
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  const [isCompact, setIsCompact] = useState(false)
  // const [currSong, setCurrSong] = useState(null)
  const [searchSong, setSearchSong] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)

  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  )
  const currSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  )


  const songs = station?.songs || []
  const _currSong = currSong ? currSong : station.songs[0]


  useEffect(() => {
    if (!station || station._id !== stationId) {
      loadStation(stationId)
    }
  }, [stationId])

  async function performSearch(txt) {
    if (!txt.trim()) return
    try {
      await loadSearchResults(txt, 'songs')
    } catch (error) {
      showErrorMsg('Search failed')
    }
  }

  const debouncedSearch = useRef(
    debounce(async txt => {
      try {
        await performSearch(txt)
      } catch (error) {
        showErrorMsg('Search failed')
      }
    }, 500)
  )

  function onSubmitSearch(ev) {
    ev.preventDefault()
    performSearch(searchSong)
  }

  function handleChange({ target }) {
    const { value } = target
    setSearchSong(value)
    debouncedSearch.current(value)
  }

  function onTogglePlay(song) {
    if (!song || !song._id) {
      console.log('Invalid song passed to onTogglePlay: ', song)
      return
    }

    const currPlayer = window.playerRef?.current
    if (!currPlayer) return

    if (currSong?._id === song?._id) {

      if (isPlaying) {
        currPlayer.pauseVideo()
        setIsPlaying(false)
      } else {
        currPlayer.playVideo()
        setIsPlaying(true)
      }

    } else {
      setSong(song)
      setIsPlaying(true)
    }

  }

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

  function onPlaySong(song) {
    const playerRef = window.playerRef
    const currPlayer = playerRef?.current

    if (!currPlayer) return

    if (currentSong?._id === song._id) {
        if (isPlaying) {
          currPlayer.pauseVideo()
          setIsPlaying(false)
        } else {
            currPlayer.playVideo()
            setIsPlaying(true)
        }
    } else {
        setSong(song)
        setIsPlaying(true)
    }
  }
  // async function onPlaySong(song = station.songs[0]) {
  //   console.log('song:',song)
  //   // console.log('station: ',station.songs[0])
  //   await setSong(song)
  //   await setIsPlaying()
  //   togglePlay(isPlaying)
  // }


  return (
    <section className="station-play-list">
      <header className="station-header">
        <img src={station.imgUrl} alt="" />
        <h1>{station.name}</h1>
      </header>
      <div className="playlist-play-actions">

        <div className="media-player-container">
          <PlayButton
            onToggle={() => onTogglePlay(_currSong)}
            isPlaying={isPlaying}
            addClassName={'play-btn'}
          />
        </div>

        <button className="btn-compact">Compact</button>
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
            <tr key={idx} className="song-row">
              <td className="song-play-idx">
                <span className="song-idx">{idx + 1}</span>
                <span className="play-icon" onClick={() => onTogglePlay(song)}>
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
      <button onClick={() => setShowSearchBar(!showSearchBar)}>Find more</button>
      {showSearchBar && (
        <section className="song-search-section">
          <form className="" action="" onSubmit={onSubmitSearch}>
            <input
              value={searchSong}
              onChange={handleChange}
              type="search"
              placeholder="Enter song name"
              id="name"
              name="name"
            />
            <label htmlFor="name"></label>
          </form>
          <SongSearchResult />
        </section>
      )}
      {/* <button onClick={() => { onAddStationMsg(station._id) }}>Add station msg</button> */}
    </section>
  )
}

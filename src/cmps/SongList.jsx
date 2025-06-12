import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// DND: Import drag-and-drop components
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import {
  loadStation,
  addStationMsg,
  setSong,
  setIsPlaying,
  togglePlay,
  addStation,
  removeStation,
} from '../store/station/station.actions'
import { SongSearchResult } from './SongSearchResult'
import { loadSearchResults } from '../store/search/search.actions'
import { debounce } from '../services/util.service'
import { PlayButton } from './PlayButton'
import { SongPreview } from './SongPreview'
import { AddIcon } from './svg/AddIcon'
import { updateUser } from '../store/user/user.actions'

export function SongList() {
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  const user = useSelector(storeState => storeState.userModule.user)
  const stations = useSelector(storeState => storeState.stationModule.stations)

  useEffect(() => {
    if (!station || station._id !== stationId) {
      loadStation(stationId)
    }
  }, [stationId])


  // const [isCompact, setIsCompact] = useState(false)

  const [searchSong, setSearchSong] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)

  const isPlaying = useSelector(storeState => storeState.stationModule.isPlaying)
  // console.log('station: ',station)
  // const currSong = useSelector((storeState) => storeState.stationModule.currentSong) || (station?.songs[0])

  // *****************************
  const currSong = useSelector(storeState => storeState.stationModule.currentSong)
  /// ***** CANCELED TO FIX THE NOT PLAYING 1ST SONG BUG
  // const currentSongFromStore = useSelector(storeState => storeState.stationModule.currentSong)
  // const currSong = currentSongFromStore || (station && station.songs ? station.songs[0] : null)

  // DND: songs are now a state, so we can reorder them when dragging
  const [songs, setSongs] = useState([])

  // DND: When station changes, update songs
  useEffect(() => {
    if (station?.songs) setSongs(station.songs)
  }, [station])
  // ^^Using the useEffect with setSongs above instead of line no. 47 now ^^
  // const songs = station?.songs || []

  // const _currSong = currSong ? currSong : station.songs[0]

  // useEffect(() => {
  //   if (!station || station._id !== stationId) {
  //     loadStation(stationId)
  //   }
  // }, [stationId])

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
    const currPlayer = window.playerRef?.current
    if (!currPlayer || !song || !song.id) return

    // ⚠️ IMPORTANT: guard against undefined station
    if (!station || !station._id || !station.songs) {
      console.warn('Cannot play song: station is not ready yet')
      return
    }

    if (currSong?.id === song.id) {
      if (isPlaying) {
        currPlayer.pauseVideo()
        setIsPlaying(false)
      } else {
        currPlayer.playVideo()
        setIsPlaying(true)
      }
    } else {
      setSong(song, station) // ✅ pass correct station
      setIsPlaying(true)
    }
  }

  // TODO - make first click play the first song
  function onTogglePlay(song) {
    console.log('onTogglePlay - SongList')
    // console.log('song: ',song.id)
    // console.log('currSong: ',currSong.id)

    // console.log('song: ',song)

    if (!song || !song.id) {
      console.log('Invalid song passed to onTogglePlay: ', song)
      return
    }

    // Added check for valid station
    if (!station || !station._id || !station.songs) {
      console.warn('Cannot play song: station is not ready yet')
      return
    }

    const currPlayer = window.playerRef?.current
    if (!currPlayer) return

    if (currSong?.id === song?.id) {
      // console.log('A')
      if (isPlaying) {
        // console.log('A 1')

        currPlayer.pauseVideo()
        setIsPlaying(false)
      } else {
        // console.log('A 2')

        currPlayer.playVideo()
        setIsPlaying(true)
      }
    } else {
      // console.log('B')

      setSong(song, station)
      setIsPlaying(true)
      // currPlayer.playVideo()
    }
  }

  // DND: handleDragEnd for drag-and-drop reordering
  function handleDragEnd(result) {
    if (!result.destination) return
    const reordered = Array.from(songs)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setSongs(reordered)
  }

  // async function onAddStationMsg(stationId) {
  //     try {
  //         await addStationMsg(stationId, 'bla bla ' + parseInt(Math.random() * 10))
  //         showSuccessMsg(`Station msg added`)
  //     } catch (err) {
  //         showErrorMsg('Cannot add station msg')
  //     }

  // }

  async function onAddToLibrary(station) {
    try {
      const existingLikedStation = stations.find(s => s.origId === station._id || s._id === station._id)

      let updatedStationIds

      if (existingLikedStation) {
        updatedStationIds = user.likedStationIds.filter(id => id !== existingLikedStation._id)
        await removeStation(existingLikedStation._id)
      } else {
        let stationToAdd = { ...station, origId: station._id }
        delete stationToAdd._id
        const addedStation = await addStation(stationToAdd)
        updatedStationIds = [...user.likedStationIds, addedStation._id]
      }

      const updatedUser = { ...user, likedStationIds: updatedStationIds }
      const updated = await updateUser(updatedUser)

      console.log('updated:', updated)
    } catch (error) {
      console.log('error:', error)
      showErrorMsg(`Couldn't add to library`)
    }
  }

  if (!station) return <div>Loading songs list...</div>

  return (
    <section className="station-songlist">
      <header className="station-header">
        <img
          src={
            station.imgUrl ||
            'https://img.freepik.com/premium-photo/single-white-musical-note-black-background_14117-574607.jpg'
          }
          alt=""
        />
        <h1>{station.name}</h1>
      </header>
      <div className="songlist-play-actions">
        <div className="media-player-container">
          <PlayButton
            onToggle={() => currSong && onTogglePlay(currSong)}
            isPlaying={isPlaying}
            addClassName="songlist-play-btn"
          />
          <button
            title="Save to Your Library"
            onClick={() => {
              onAddToLibrary(station)
            }}
          >
            <AddIcon />
          </button>
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
            <th>🕙</th>
            {/* <th>Duration</th> */}
          </tr>
        </thead>
        {/* DND: Wrap tbody in DragDropContext and Droppable */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="songs-droppable" direction="vertical">
            {provided => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {songs.map((song, idx) => (
                  <Draggable key={song.id + idx} draggableId={song.id} index={idx}>
                    {provided => (
                      <SongPreview
                        song={song}
                        idx={idx}
                        station={station}
                        togglePlay={() => onTogglePlay(song)}
                        draggableProps={provided.draggableProps} // DND: pass drag props
                        dragHandleProps={provided.dragHandleProps} // DND: pass handle props
                        innerRef={provided.innerRef} // DND: pass ref
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </table>
      <button className="find-more-btn" onClick={() => setShowSearchBar(!showSearchBar)}>
        {showSearchBar ? (
          <svg
            className="find-more-svg"
            width="32"
            height="32"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ verticalAlign: 'middle' }}
            aria-label="Close"
          >
            <line x1="6" y1="6" x2="16" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="16" y1="6" x2="6" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        ) : (
          'Find more'
        )}
      </button>
      {showSearchBar && (
        <section className="song-search-section">
          <h4>Let's find something for your playlist</h4>
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

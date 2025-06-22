import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
// import { ColorThief } from '../cmps/ColorThief' 

import { debounce, cleanTitle, calcStationDuration } from '../services/util.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { useHeadingFontSize } from '../customHooks/useHeadingFontSize'

import {
  loadStation,
  addStationMsg,
  setSong,
  setIsPlaying,
  addStation,
  removeStation,
  setStationOrder
} from '../store/station/station.actions'
import { updateUser } from '../store/user/user.actions'
import { loadSearchResults } from '../store/search/search.actions'
import { store } from '../store/store'

import { SongSearchResult } from './SongSearchResult'
import { StationEditModal } from './StationEditModal'
import { DominantColorExtractor } from './DominantColorExtractor'
import { PlayBtn } from './PlayBtn'
import { SongPreview } from './SongPreview'
import { AddIcon } from './svg/AddIcon'

export function SongList() {
  const { stationId } = useParams()

  // Redux selectors
  const user = useSelector((storeState) => storeState.userModule.user)
  const isPlaying = useSelector((storeState) => storeState.stationModule.isPlaying)
  const currSong = useSelector((storeState) => storeState.stationModule.currentSong)

  const stations = useSelector((storeState) => storeState.stationModule.stations)
  const station = useSelector((storeState) => storeState.stationModule.station)
  const currentStation = useSelector((storeState) => storeState.stationModule.currentStation)

  // Local state
  const [songs, setSongs] = useState([])
  const [searchSong, setSearchSong] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [dominantColor, setDominantColor] = useState('#121212') 

  // Refs
  const modalRef = useRef()
  const headingRef = useRef()

  const debouncedSearch = useRef(
    debounce(async (txt) => {
      try {
        await performSearch(txt)
      } catch (error) {
        showErrorMsg('Search failed')
      }
    }, 500)
  )

  // Derived values
  const isLikedStation = station?._id === user?.likedSongsStationId
  const isOwnedByUser = isLikedStation || station?.createdBy?._id === user?._id
  const isPlay = isPlaying ? 'songlist-pause-icon' : 'songlist-play-icon'
  const headerFontSize = useHeadingFontSize(headingRef, [station?.name])

  // Memoized values
  const stationDuration = useMemo(() => {
    return calcStationDuration(station?.songs || [])
  }, [station?.songs])

  // UseEffects
  useEffect(() => {
    if (!station || station._id !== stationId) loadStation(stationId)
  }, [stationId])

  useEffect(() => {
    if (station?.songs) setSongs(station.songs)
  }, [station])

  // Event Handlers - Search
  async function performSearch(txt) {
    if (!txt.trim()) return
    try {
      await loadSearchResults(txt, 'songs')
    } catch (error) {
      showErrorMsg('Search failed')
    }
  }

  function onSubmitSearch(ev) {
    ev.preventDefault()
    performSearch(searchSong)
  }

  function handleChange({ target }) {
    const { value } = target
    setSearchSong(value)
    debouncedSearch.current(value)
  }

  // Event Handlers - Play toggle
  function onTogglePlay(song) {
    if (!song || !song.id) {
      console.log('Invalid song passed to onTogglePlay: ', song)
      return
    }

    if (!station || !station._id || !station.songs) {
      console.warn('Cannot play song: station is not ready yet')
      return
    }

    const currPlayer = window.playerRef?.current
    if (!currPlayer) return

    if (currSong?.id === song?.id) {
      if (isPlaying) {
        currPlayer.pauseVideo()
        setIsPlaying(false)
      } else {
        currPlayer.playVideo()
        setIsPlaying(true)
      }
    } else {
      setSong(song, station)
      setIsPlaying(true)
    }
  }

  function handleSongPlay() {
    let song = currSong || station.songs[0]
    if (station._id !== currentStation?._id) song = station.songs[0]

    onTogglePlay(song)
  }

  // Event Handlers - Drag and Drop
  function handleDragEnd(result) {
    if (!result.destination) return
    const reordered = Array.from(songs)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setSongs(reordered)
  }

  // Event Handlers - User actions (mutations)
  async function onAddToLibrary(station) {
    try {
      const existingLikedStation = stations.find((s) => s.origId === station._id || s._id === station._id)

      const state = store.getState()
      const stationOrder = state.stationModule.stationOrder
      let newOrder = []
      let updatedStationIds

      if (existingLikedStation) {
        updatedStationIds = user.likedStationIds.filter((id) => id !== existingLikedStation._id)
        await removeStation(existingLikedStation._id)
        newOrder = stationOrder.filter((id) => id !== existingLikedStation._id)
      } else {
        let stationToAdd = { ...station, origId: station._id }
        delete stationToAdd._id
        const addedStation = await addStation(stationToAdd)
        updatedStationIds = [...user.likedStationIds, addedStation._id]

        newOrder = [...stationOrder, addedStation._id]
      }

      setStationOrder(newOrder)

      const updatedUser = { ...user, likedStationIds: updatedStationIds }
      const updated = await updateUser(updatedUser)
    } catch (error) {
      console.log('error:', error)
      showErrorMsg(`Couldn't add to library`)
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

  if (!station) return <div>Loading songs list...</div>

  return (
    <section className="station-songlist">
      <DominantColorExtractor imgUrl={station.imgUrl} onSetColor={setDominantColor} />
      <div 
        className="station-header-container"
        style={{ backgroundColor: `${dominantColor}`,
          backgroundImage: `linear-gradient(transparent 0%, rgba(0, 0, 0, 0.5) 100%)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          boxShadow: `0 1px 232px 0 ${dominantColor}`
        }}  
      >
        <header className="station-header">
          <img
            src={
              station.imgUrl ||
              'https://img.freepik.com/premium-photo/single-white-musical-note-black-background_14117-574607.jpg'
            }
            alt=""
          />
          {/* <div>
            <h1 style={{ headerFontSize }} className="station-header-name" onClick={() => modalRef.current?.openModal()}> 
              {cleanTitle(station.name)}
            </h1>

            <span>{station.description}</span>
          </div> */}
          
          {/* Station Info */}
          <div>
            <span className="playlist-label">
              {isLikedStation ? 'Playlist' : 'Public Playlist'}

            </span>

            <h1 style={{ headerFontSize }} className="station-header-name" onClick={() => modalRef.current?.openModal()}> 
              {cleanTitle(station.name)}
            </h1>

            <div className="station-meta flex align-center">
              <span className="created-by">{isOwnedByUser ? user.fullname : 'MisterBeat'}</span>
              <span className="dot">•</span>
              {station?.songs?.length > 0 && (
                <p>
                  <span>
                      {station.songs.length} {station.songs.length === 1 ? 'song' : 'songs'}
                  </span>

                  {!isLikedStation && stationDuration && (
                    <>
                      <span className="comma">,&nbsp;</span>
                      <span>{stationDuration}</span>
                    </>
                  )}
                </p>
              )}
            </div>

            <span>{station.description}</span>
          </div>
          {/* Station Info */}

          {/* DIALOOOOOOOOOGGGGGGGGG */}
          <StationEditModal ref={modalRef} />
          {/* DIALOOOOOOOOOGGGGGGGGG */}
        </header>
      </div>

      <div className="songlist-play-actions">
        <div className="media-player-container">
          <PlayBtn onToggle={handleSongPlay} isPlaying={isPlaying} className={isPlay} />
          <button
            className='save-playlist add-song'
            title="Save to Your Library"
            onClick={() => {
              onAddToLibrary(station)
            }}
          >
            <AddIcon />
          </button>
        </div>

        {/* TODO: Will put it back after finishing the layout */}
        {/* <button className="btn-compact">Compact</button> */}
      </div>

      <div className="song-list-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Album</th>
              <th>Date Added</th>
              <th>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="8.5" stroke="#b3b3b3" stroke-width="1.5" />
                  <line x1="11" y1="7" x2="11" y2="11" stroke="#b3b3b3" stroke-width="1.5" stroke-linecap="round" />
                  <line x1="11" y1="11" x2="14" y2="11" stroke="#b3b3b3" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </th>
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
      </div>

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

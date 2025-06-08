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
  togglePlay
} from '../store/station/station.actions'
import { SongSearchResult } from './SongSearchResult'
import { loadSearchResults } from '../store/search/search.actions'
import { debounce } from '../services/util.service'
import { PlayButton } from './PlayButton'
import { SongPreview } from './SongPreview'

export function SongList() {
  const { stationId } = useParams()
  const station = useSelector((storeState) => storeState.stationModule.station)

  useEffect(() => {
    if (!station || station._id !== stationId) {
      loadStation(stationId)
    }
  }, [stationId])

  // const [isCompact, setIsCompact] = useState(false)

  const [searchSong, setSearchSong] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)

  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  )
  // console.log('station: ',station)
  // const currSong = useSelector((storeState) => storeState.stationModule.currentSong) || (station?.songs[0])

  const currentSongFromStore = useSelector(
    (storeState) => storeState.stationModule.currentSong
  )
  const currSong =
    currentSongFromStore || (station && station.songs ? station.songs[0] : null)

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
    debounce(async (txt) => {
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

  // TODO - make first click play the first song
  function onTogglePlay(song) {
    console.log('onTogglePlay - SongList')
    // console.log('song: ',song._id)
    // console.log('currSong: ',currSong._id)

    // console.log('song: ',song)

    if (!song || !song._id) {
      console.log('Invalid song passed to onTogglePlay: ', song)
      return
    }

    const currPlayer = window.playerRef?.current
    if (!currPlayer) return

    if (currSong?._id === song?._id) {
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

      setSong(song)
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

  if (!station) return <div>Loading songs list...</div>

  return (
    <section className="station-songlist">
      <header className="station-header">
        <img src={station.imgUrl} alt="" />
        <h1>{station.name}</h1>
      </header>
      <div className="songlist-play-actions">
        <div className="media-player-container">
          <PlayButton
            onToggle={() => currSong && onTogglePlay(currSong)}
            isPlaying={isPlaying}
            addClassName="songlist-play-btn"
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
        {/* DND: Wrap tbody in DragDropContext and Droppable */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="songs-droppable" direction="vertical">
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {songs.map((song, idx) => (
                  <Draggable key={song._id} draggableId={song._id} index={idx}>
                    {(provided) => (
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
      <button onClick={() => setShowSearchBar(!showSearchBar)}>
        Find more
      </button>
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

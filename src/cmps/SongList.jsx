import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { showErrorMsg } from '../services/event-bus.service'
import { loadStation, setSong, setIsPlaying } from '../store/station/station.actions'
import { SongSearchResult } from './SongSearchResult'
import { loadSearchResults } from '../store/search/search.actions'
import { debounce } from '../services/util.service'
import { PlayButton } from './PlayButton'
import { SongPreview } from './SongPreview'

export function SongList() {
  const { stationId } = useParams()
  const dispatch = useDispatch()
  const station = useSelector(store => store.stationModule.station)
  const isPlaying = useSelector(store => store.stationModule.isPlaying)
  const currentSongFromStore = useSelector(store => store.stationModule.currentSong)

  const currSong = currentSongFromStore || (station?.songs?.[0] || null)
  const [songs, setSongs] = useState([])
  const [searchSong, setSearchSong] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)

  useEffect(() => {
    if (!station || station._id !== stationId) {
      loadStation(stationId)
    }
  }, [stationId])

  useEffect(() => {
    if (station?.songs) setSongs(station.songs)
  }, [station])

  const debouncedSearch = useRef(
    debounce(async txt => {
      try {
        await loadSearchResults(txt, 'songs')
      } catch {
        showErrorMsg('Search failed')
      }
    }, 500)
  )

  function onSubmitSearch(ev) {
    ev.preventDefault()
    performSearch(searchSong)
  }

  function performSearch(txt) {
    if (!txt.trim()) return
    debouncedSearch.current(txt)
  }

  function handleChange({ target }) {
    const { value } = target
    setSearchSong(value)
    debouncedSearch.current(value)
  }

  function onTogglePlay(song) {
    if (!song?._id) return
    const currPlayer = window.playerRef?.current
    if (!currPlayer) return

    if (currSong?._id === song._id) {
      if (isPlaying) {
        currPlayer.pauseVideo()
        dispatch(setIsPlaying(false))
      } else {
        currPlayer.playVideo()
        dispatch(setIsPlaying(true))
      }
    } else {
      dispatch(setSong(song))
      dispatch(setIsPlaying(true))
    }
  }

  function handleDragEnd(result) {
    if (!result.destination) return
    const reordered = Array.from(songs)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setSongs(reordered)
  }

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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="songs-droppable" direction="vertical">
            {provided => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {songs.map((song, idx) => (
                  <Draggable key={song._id} draggableId={song._id} index={idx}>
                    {provided => (
                      <SongPreview
                        song={song}
                        idx={idx}
                        station={station}
                        togglePlay={() => onTogglePlay(song)}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        innerRef={provided.innerRef}
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

      <button onClick={() => setShowSearchBar(!showSearchBar)}>Find more</button>
      {showSearchBar && (
        <section className="song-search-section">
          <form onSubmit={onSubmitSearch}>
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
    </section>
  )
}

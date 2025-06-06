import { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DndContext, closestCenter } from '@hello-pangea/dnd'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@hello-pangea/dnd'

import { loadStation, setSong, setIsPlaying } from '../store/station/station.actions'
import { loadSearchResults } from '../store/search/search.actions'
import { SongSearchResult } from './SongSearchResult'
import { PlayButton } from './PlayButton'
import { SongPreview } from './SongPreview'
import { SortableSong } from './SortableSong'
import { debounce, showErrorMsg } from '../services/util.service'

export function SongList() {
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  const isPlaying = useSelector(storeState => storeState.stationModule.isPlaying)
  const currentSongFromStore = useSelector(storeState => storeState.stationModule.currentSong)

  const [searchSong, setSearchSong] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [orderedSongs, setOrderedSongs] = useState([])

  const currSong = currentSongFromStore || (station && station.songs?.[0])

  const debouncedSearch = useRef(
    debounce(async txt => {
      try {
        await loadSearchResults(txt, 'songs')
      } catch (err) {
        showErrorMsg('Search failed')
      }
    }, 500)
  )

  useEffect(() => {
    if (!station || station._id !== stationId) loadStation(stationId)
  }, [stationId])

  useEffect(() => {
    if (station?.songs) setOrderedSongs(station.songs)
  }, [station?.songs])

  function onSubmitSearch(ev) {
    ev.preventDefault()
    if (searchSong.trim()) debouncedSearch.current(searchSong)
  }

  function handleChange({ target }) {
    setSearchSong(target.value)
    debouncedSearch.current(target.value)
  }

  function onTogglePlay(song) {
    if (!song?._id) return
    const player = window.playerRef?.current
    if (!player) return

    if (currSong?._id === song._id) {
      if (isPlaying) {
        player.pauseVideo()
        setIsPlaying(false)
      } else {
        player.playVideo()
        setIsPlaying(true)
      }
    } else {
      setSong(song)
      setIsPlaying(true)
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = orderedSongs.findIndex(song => song._id === active.id)
    const newIndex = orderedSongs.findIndex(song => song._id === over.id)
    setOrderedSongs(arrayMove(orderedSongs, oldIndex, newIndex))
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
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedSongs.map(song => song._id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {orderedSongs.map((song, idx) => (
                <SortableSong
                  key={song._id}
                  song={song}
                  idx={idx}
                  station={station}
                  togglePlay={() => onTogglePlay(song)}
                />
              ))}
            </tbody>
          </SortableContext>
        </DndContext>
      </table>

      <button onClick={() => setShowSearchBar(prev => !prev)}>Find more</button>

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
          </form>
          <SongSearchResult />
        </section>
      )}
    </section>
  )
}

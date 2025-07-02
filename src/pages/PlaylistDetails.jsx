import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SongList } from '../cmps/SongList'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
// import { ColorThief } from '../cmps/ColorThief'

import { debounce, cleanTitle, calcStationDuration } from '../services/util.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { useHeadingFontSize } from '../hooks/useHeadingFontSize'
import equalizerGif from '/src/assets/img/equalizer.gif'

import {
  loadStation,
  addStationMsg,
  setSong,
  setIsPlaying,
  addStation,
  removeStation,
  setStationOrder,
} from '../store/station/station.actions'
import { updateUser } from '../store/user/user.actions'
import { loadSearchResults } from '../store/search/search.actions'
import { store } from '../store/store'

import { SongSearchResult } from '../cmps/SongSearchResult'
import { StationEditModal } from '../cmps/StationEditModal'
import { DominantColorExtractor } from '../cmps/DominantColorExtractor'
import { PlayBtn } from '../cmps/PlayBtn'
import { SongPreview } from '../cmps/SongPreview'
import { LikeIcon } from '../cmps/svg/LikeIcon'
import { SearchIcon } from '../cmps/svg/SearchIcon'
import { ClearIcon } from '../cmps/svg/ClearIcon'
import { ClearIconLarge } from '../cmps/svg/ClearIconLarge'
import { LikeLargeIcon } from '../cmps/svg/LikeLargeIcon'
import { RemoveFromLikedLargeIcon } from '../cmps/svg/RemoveFromLikedLargeIcon'
import { LikeToggleBtn } from '../cmps/LikeToggleBtn'

// TODOs:
// [] create list btn
// [] songListPage and SongList will be the list
// []

export function PlaylistDetails() {
  const { stationId } = useParams()

  // Redux selectors
  const user = useSelector(storeState => storeState.userModule.user)
  const isPlaying = useSelector(storeState => storeState.stationModule.isPlaying)
  const currSong = useSelector(storeState => storeState.stationModule.currentSong)

  const stations = useSelector(storeState => storeState.stationModule.stations)
  const station = useSelector(storeState => storeState.stationModule.station)
  const currentStation = useSelector(storeState => storeState.stationModule.currentStation)
  const stationOrder = useSelector(state => state.stationModule.stationOrder)

  // Local state
  const [songs, setSongs] = useState([])
  const [searchSongTxt, setSearchSongTxt] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [dominantColor, setDominantColor] = useState('#121212')

  // Refs
  const modalRef = useRef()
  const headingRef = useRef()

  const debouncedSearch = useRef(
    debounce(async txt => {
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
  const isLikedPlaylist = useSelector(state => state.userModule.user?.likedStationIds?.includes(station?._id))

  // Memoized values
  const stationDuration = useMemo(() => {
    return calcStationDuration(station?.songs || [])
  }, [station?.songs])

  // check if station is LikedSongs
  const isLikedSongs = station?.name === 'Liked Songs'

  // UseEffects
  useEffect(() => {
    if (!station || station._id !== stationId) loadStation(stationId)
  }, [stationId])

  useEffect(() => {
    if (station?.songs) setSongs(station.songs)
  }, [station])

  useEffect(() => {
    setSearchSongTxt('')
  }, [stationId])

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
    performSearch(searchSongTxt)
  }

  function handleChange({ target }) {
    const { value } = target
    setSearchSongTxt(value)
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
      // Check if this station is already in likedStationIds
      const alreadyLiked = user.likedStationIds.includes(station._id)

      let updatedStationIds, newOrder

      if (alreadyLiked) {
        // Remove from liked stations
        updatedStationIds = user.likedStationIds.filter(id => id !== station._id)
        newOrder = stationOrder.filter(id => id !== station._id)
        showSuccessMsg('Removed from Your Library')
      } else {
        // Add the existing station._id, do NOT create a duplicate
        updatedStationIds = [...user.likedStationIds, station._id]
        newOrder = [...stationOrder, station._id]
        showSuccessMsg('Added to Your Library')
      }

      setStationOrder(newOrder)
      const updatedUser = { ...user, likedStationIds: updatedStationIds }
      await updateUser(updatedUser)
    } catch (error) {
      showErrorMsg(`Couldn't add to library`)
      console.log('error:', error)
    }
  }

  // async function onAddToLibrary(station) {
  //   try {
  //     const state = store.getState()
  //     const stationOrder = state.stationModule.stationOrder
  //     let updatedStationIds, newOrder, addedStation

  //     if (user.likedStationIds.includes(station._id)) {
  //       // Remove
  //       updatedStationIds = user.likedStationIds.filter(id => id !== station._id)
  //       newOrder = stationOrder.filter(id => id !== station._id)
  //       showSuccessMsg('Removed from Your Library')
  //     } else {
  //       // Add
  //       addedStation = stations.find(s => s._id === station._id)
  //       if (!addedStation) {
  //         let stationToAdd = { ...station, origId: station._id }
  //         delete stationToAdd._id
  //         addedStation = await addStation(stationToAdd)
  //       }
  //       updatedStationIds = [...user.likedStationIds, addedStation._id]
  //       newOrder = [...stationOrder, addedStation._id]
  //       showSuccessMsg('Added to Your Library')
  //     }

  //     setStationOrder(newOrder)
  //     const updatedUser = { ...user, likedStationIds: updatedStationIds }
  //     await updateUser(updatedUser)
  //   } catch (error) {
  //     console.log('error:', error)
  //     showErrorMsg(`Couldn't add to library`)
  //   }
  // }

  // async function onAddToLibrary(station) {
  //   try {
  //     const existingLikedStation = stations.find((s) => s.origId === station._id || s._id === station._id)

  //     const state = store.getState()
  //     const stationOrder = state.stationModule.stationOrder
  //     let newOrder = []
  //     let updatedStationIds

  //     if (existingLikedStation) {
  //       updatedStationIds = user.likedStationIds.filter((id) => id !== existingLikedStation._id)
  //       await removeStation(existingLikedStation._id)
  //       newOrder = stationOrder.filter((id) => id !== existingLikedStation._id)
  //     } else {
  //       let stationToAdd = { ...station, origId: station._id }
  //       delete stationToAdd._id
  //       const addedStation = await addStation(stationToAdd)
  //       updatedStationIds = [...user.likedStationIds, addedStation._id]

  //       newOrder = [...stationOrder, addedStation._id]
  //     }

  //     setStationOrder(newOrder)

  //     const updatedUser = { ...user, likedStationIds: updatedStationIds }
  //     const updated = await updateUser(updatedUser)
  //   } catch (error) {
  //     console.log('error:', error)
  //     showErrorMsg(`Couldn't add to library`)
  //   }
  // }

  // async function onAddStationMsg(stationId) {
  //     try {
  //         await addStationMsg(stationId, 'bla bla ' + parseInt(Math.random() * 10))
  //         showSuccessMsg(`Station msg added`)
  //     } catch (err) {
  //         showErrorMsg('Cannot add station msg')
  //     }

  // }

  function getStationImg() {
    return station?.imgUrl
      ? station?.imgUrl
      : `https://res.cloudinary.com/dpoa9lual/image/upload/v1724570942/Spotify_playlist_photo_yjeurq.png`
  }

  // if (!station) return <div>Loading songs list...</div>

  if (!station) {
    return (
      <div className="loader-overlay">
        <img className="loader-gif" src={equalizerGif} alt="Loading..." />
      </div>
    )
  }

  return (
    <section className="station-songlist">
      <DominantColorExtractor imgUrl={getStationImg()} onSetColor={setDominantColor} />

      <div
        className="station-header-container"
        style={{
          backgroundColor: `${dominantColor}`,
          backgroundImage: `linear-gradient(transparent 0%, rgba(0, 0, 0, 0.5) 100%)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          boxShadow: `0 1px 232px 0 ${dominantColor}`,
        }}
      >
        <header className="station-header">
          <img
            src={getStationImg()}
            // src={
            //   station.imgUrl ||
            //   'https://img.freepik.com/premium-photo/single-white-musical-note-black-background_14117-574607.jpg'
            // }
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
            <span className="playlist-label">{isLikedStation ? 'Playlist' : 'Public Playlist'}</span>

            <h1
              style={{ headerFontSize }}
              className="station-header-name"
              onClick={() => modalRef.current?.openModal()}
            >
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

      {station?.songs?.length > 0 && (
        <div className="songlist-play-actions">
          <div className="media-player-container">
            <PlayBtn onToggle={handleSongPlay} isPlaying={isPlaying} className={isPlay} />

            {!isLikedStation && user && (
              <button
                className="add-remove-playlist"
                title={isLikedPlaylist ? 'Remove from Your Library' : 'Save to Your Library'}
                onClick={() => onAddToLibrary(station)}
              >
                {isLikedPlaylist ? (
                  <RemoveFromLikedLargeIcon color={'var(--text-bright-accent)'} />
                ) : (
                  <LikeLargeIcon color={'#b3b3b3'} />
                )}
              </button>
            )}
          </div>
          {/* TODO: Will put it back after finishing the layout */}
          {/* <button className="btn-compact">Compact</button> */}
        </div>
      )}

      <div className="content-spacing">
        {station?.songs?.length > 0 && (
          <SongList
            songs={songs}
            station={station}
            onTogglePlay={onTogglePlay}
            handleDragEnd={handleDragEnd}
            isLikedSongs={isLikedSongs}
          />
        )}

        {!showSearchBar && (
          <button className="open-find-more-btn" onClick={() => setShowSearchBar(!showSearchBar)}>
            Find more
          </button>
        )}

        {showSearchBar && (
          <section className="song-search-section">
            <section className="song-search-header">
              <div className="song-search-header-inner">
                <h4>Let's find something for your playlist</h4>
                <form className="" action="" onSubmit={onSubmitSearch}>
                  <input
                    value={searchSongTxt}
                    onChange={handleChange}
                    type="search"
                    placeholder="Search for songs of episodes"
                    id="name"
                    name="name"
                    autocomplete="off"
                  />
                  <SearchIcon />

                  {searchSongTxt.length > 0 && <ClearIcon onClick={() => setSearchSongTxt('')} />}
                </form>
              </div>

              <button className="close-find-more-btn" onClick={() => setShowSearchBar(!showSearchBar)}>
                <ClearIconLarge />
              </button>
            </section>

            {searchSongTxt.length > 0 && <SongSearchResult />}
          </section>
        )}
      </div>
    </section>
  )
}

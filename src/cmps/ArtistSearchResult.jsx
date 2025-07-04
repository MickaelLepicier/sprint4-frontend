import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { addStation } from '../store/station/station.actions'
import { cleanTitle } from '../services/util.service'
import { SidebarPlayBtn } from './Sidebar/SidebarPlayBtn'
import { LikeToggleBtn } from './LikeToggleBtn'
import equalizerGif from '/src/assets/img/equalizer.gif'

export function ArtistSearchResult() {
  const artistStations = useSelector(state => state.searchModule.searchResults)
  const currSong = useSelector(state => state.stationModule.currentSong)
  const isPlaying = useSelector(state => state.stationModule.isPlaying)
  const isLoader = useSelector(state => state.systemModule.isLoading)
  const user = useSelector(state => state.userModule.user)

  const [selectedSongId, setSelectedSongId] = useState(null)
  const [justLikedSongId, setJustLikedSongId] = useState(null)

  const listRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setSelectedSongId(null)
        setJustLikedSongId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  async function onGoToStation(station) {
    if (!user) {
      dispatch({ type: SET_STATION, station })
      navigate(`/playlist/${station._id}`)
    } else {
      const savedStation = await addStation(station)
      dispatch({ type: SET_STATION, station: savedStation })
      navigate(`/playlist/${savedStation._id}`)
    }
  }

  function onSetSong(song, forceSeek = false) {
    dispatch({ type: SET_SONG, song })
    dispatch({ type: SET_IS_PLAYING, isPlaying: true })
    if (forceSeek && window.playerRef?.current) {
      window.playerRef.current.seekTo(0)
    }
  }

  if (isLoader || !artistStations?.length) {
    return (
      <div className="loader-overlay">
        <img className="loader-gif" src={equalizerGif} alt="Loading..." />
      </div>
    )
  }

  const topArtist = artistStations[0]
  const topSongs = topArtist.songs.slice(0, 4)

  return (
    <section className="header-search-stations">
      <div className="content-spacing">
        <div className="grid-container">
          <div className="grid-inner">
            <div className="top-result">
              <div className="title-wrapper row-title">
                <h1>Top Result</h1>
              </div>
              <div
                className={`artist-preview${isPlaying && currSong?.id === topArtist.songs[0]?.id ? ' playing' : ''}`}
              >
                <div className="img-container">
                  <img src={topArtist.imgUrl} alt={topArtist.name} />
                </div>
                <div className="artist-info">
                  {/* <span className="artist-title">{topArtist.name}</span> */}
                  <span className="artist-title">{topArtist.songs[0]?.title}</span>
                  <div className="artist-meta">
                    <span className="prefix">Song </span>
                    {/* <span className="artist-name">{topArtist.createdBy.fullname}</span> */}
                    <span className="artist-name">{topArtist.createdBy.fullname}</span>
                  </div>
                </div>
                <div className="btn-container encore-bright-accent-set">
                  <SidebarPlayBtn song={topArtist.songs[0]} isLargePlayIcon={true} />
                </div>
              </div>
            </div>

            <div className="songs-results">
              <div className="title-wrapper">
                <h2 className="row-title">Songs</h2>
              </div>
              <div className="ul-wrapper">
                <ul ref={listRef}>
                  {topSongs.map(song => (
                    <li
                      key={song.id}
                      className={`
                        ${selectedSongId === song.id ? 'active' : ''}
                        ${justLikedSongId === song.id ? 'just-liked' : ''}
                        ${currSong?.id === song.id && isPlaying ? 'playing' : ''}
                      `}
                      onClick={() => setSelectedSongId(song.id)}
                      onDoubleClick={() => onSetSong(song, true)}
                    >
                      <div className="main-details flex">
                        <div className="img-container">
                          <img src={song.imgUrl} />
                          <SidebarPlayBtn song={song} isLargePlayIcon={true} />
                        </div>
                        <div className="song-details">
                          <span className="title">{cleanTitle(song.title)}</span>
                          <span className="artist">{topArtist.createdBy.fullname}</span>
                        </div>
                      </div>

                      <div className="song-meta-actions">
                        <div className="btn-container" onClick={e => e.stopPropagation()}>
                          <LikeToggleBtn
                            song={song}
                            onLike={() => {
                              setJustLikedSongId(song.id)
                              setSelectedSongId(null)
                            }}
                            onUnlike={() => {
                              setSelectedSongId(song.id)
                              setJustLikedSongId(null)
                            }}
                          />
                        </div>
                        <div className="duration">{formatTime(song.duration)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="artists-section">
              <div className="title-wrapper row-title">
                <h1>Artists</h1>
              </div>
              <section className="artists-list">
                {artistStations.map(station => (
                  <div className="artist-card" key={station._id} onClick={() => onGoToStation(station)}>
                    <div className="img-container">
                      <div className="image-wrapper">
                        <img src={station.imgUrl} alt={station.name} />
                      </div>
                    </div>
                    <div className="flex column artist-info-container">
                      <span className="artist-title" title={station.name}>
                        {cleanTitle(station.name)}
                      </span>
                      <span className="artist-meta">Artist</span>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

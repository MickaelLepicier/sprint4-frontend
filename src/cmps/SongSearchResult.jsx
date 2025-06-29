import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { cleanTitle, debounce } from '../services/util.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateStation } from '../store/station/station.actions'
import { SidebarPlayBtn } from './Sidebar/SidebarPlayBtn'

export function SongSearchResult() {
  const songs = useSelector(storeState => storeState.searchModule.searchResults)
  const currStation = useSelector(storeState => storeState.stationModule.station)
  const currSong = useSelector(state => state.stationModule.currentSong)
  const isPlaying = useSelector(state => state.stationModule.isPlaying)
  const stationSongs = useSelector(storeState => storeState.stationModule.station.songs)

  const [selectedSongId, setSelectedSongId] = useState(null)
  const [justLikedSongId, setJustLikedSongId] = useState(null)
  const listRef = useRef()
  
  async function onAddSong(song) {
    console.log('song:', song)
    try {
      const normalizedSong = {
        id: song.id,
        url: `https://www.youtube.com/watch?v=${song.id}`,
        title: song.title,
        imgUrl: song.imgUrl.replace('default.jpg', 'mqdefault.jpg'),
        addedAt: Date.now(),
        addedBy: 'u999',
        likedBy: [],
        duration: song.duration,
      }

      const stationToSave = {
        ...currStation,
        songs: [...currStation.songs, normalizedSong],
      }
      await updateStation(stationToSave)
      showSuccessMsg('Song added to songlist!')
    } catch (error) {
      console.log('error:', error)
      showErrorMsg('Error adding song')
    }
  }

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

  if (!songs?.length) return null

  return (
    <section className="search-song-results">
      <div className="ul-wrapper">
        <ul ref={listRef}>
          {songs.map(song => song?.imgUrl && (
            <li
              key={song.id}
              className={`
                ${selectedSongId === song.id ? 'active' : ''}
                ${currSong?.id === song.id && isPlaying ? 'playing' : ''}
              `}
              onClick={() => setSelectedSongId(song?.id)}
            >
              <div className="main-details flex">
                <div className="img-container">
                  <img src={song.imgUrl} alt={song.title || ''} />
                  <SidebarPlayBtn song={song} isLargePlayIcon={true} />
                </div>

                <div className="song-details">
                  <span className="title">{cleanTitle(song.title)}</span>
                  <span className="artist">{song.artist || ''}</span>
                </div>
              </div>
              
              {song.album &&
                  <div className="album-container">
                    <span className="album"></span>
                  </div>
              }

              <div className="song-meta-actions">
                <button className="add-btn" onClick={() => onAddSong(song)}>
                  Add
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* <ul>
        {songs.map(song =>
          song?.imgUrl ? (
            <li key={song.id} className="song-search-row">
              <div className="song-info">
                <img src={song.imgUrl} alt={song.title || ''} />
                <div className="title-artist">
                  <h4>{cleanTitle(song.title) || ''}</h4>
                  <p>{song.artist || ''}</p>
                </div>
              </div>
              <div className="album">{song.album || ''}</div>
              <button className="add-btn" onClick={() => onAddSong(song)}>
                Add
              </button>
            </li>
          ) : null
        )}
      </ul> */}
    </section>
  )
}

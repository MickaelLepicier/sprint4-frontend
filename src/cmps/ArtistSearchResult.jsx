import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { addStation } from '../store/station/station.actions'
import { cleanTitle } from '../services/util.service'

export function ArtistSearchResult() {
  const artistStations = useSelector(storeState => storeState.searchModule.searchResults)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!artistStations?.length) return <div>Loading...</div>

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  // function onGoToStation(station) {
  //   dispatch({ type: SET_STATION, station })
  //   navigate(`/playlist/${station._id}`)
  // }

  async function onGoToStation(station) {
    const savedStation = await addStation(station)
    navigate(`/playlist/${savedStation._id}`)
  }

  function onSetSong(song) {
    console.log('song:', song)
    dispatch({ type: SET_SONG, song })
    dispatch({ type: SET_IS_PLAYING, isPlaying: true })
  }

  const topArtist = artistStations[0]
  console.log('topArtist:', topArtist)
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
              <div className="artist-preview" onClick={() => onSetSong(topArtist.songs[0])}>
                <div className="img-container">
                  <img src={topArtist.imgUrl} alt={topArtist.name} />
                </div>
                <div className="artist-info">
                  <span className="artist-title">{topArtist.name}</span>
                  <div className="artist-meta">
                    <span className="prefix">Song </span> 
                    <span className="artist-name">{topArtist.createdBy.fullname}</span>
                  </div>
                </div>
              </div>
            </div>
                        
            <div className="songs-results">
              <div className="title-wrapper">
                <h2 className="row-title">Songs</h2>
              </div>

                <div className="ul-wrapper">
                  <ul>
                    {topSongs.map(song => (
                      <li
                        key={song.id}
                        className=""
                        onClick={() => onSetSong(song)}
                      >
                        <div className="main-details flex">
                          <div className="img-container">
                            <img src={song.imgUrl} />
                            
                          </div>

                          <div className="song-details">
                            <span className="title">{cleanTitle(song.title)}</span>
                            <span className="artist">{topArtist.createdBy.fullname}</span>
                          </div>
                        </div>

                        <div className="song-meta-actions">
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
                  <div
                    className="artist-card"
                    key={station._id}
                    onClick={() => {
                      onGoToStation(station)
                    }}
                  >
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

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
      <div className="top-result-grid">
        <div className="heading-col1">
          <h1>Top Result</h1>
        </div>
        <div className="heading-col2">
          <h3>Songs</h3>
        </div>

        <div className="artist-preview" onClick={() => onSetSong(topArtist.songs[0])}>
          <img src={topArtist.imgUrl} alt={topArtist.name} />
          <div className="artist-info">
            <span className="artist-title">{topArtist.name}</span>
            <span className="artist-meta">Song · {topArtist.createdBy.fullname}</span>
            {/* If needed, you can add <span className="artist-sub">...</span> here */}
          </div>
        </div>
        <div className="first-artist-songs-preview">
          <ul>
            {topSongs.map(song => (
              <li key={song.id} className="song-preview flex align-center" onClick={() => onSetSong(song)}>
                <img src={song.imgUrl} alt={song.title} />
                <div className="song-info">
                  <span className="song-name">{cleanTitle(song.title)}</span>
                  <span className="artist-name">{topArtist.createdBy.fullname}</span>
                </div>
                <span className="song-dur">{formatTime(song.duration)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="artists-section">
        <h2>Artists</h2>
        <section className="artists-list">
          {artistStations.map(station => (
            <div
              className="artist-card"
              key={station._id}
              onClick={() => {
                onGoToStation(station)
              }}
            >
              <img src={station.imgUrl} alt={station.name} />
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
    </section>
  )
}

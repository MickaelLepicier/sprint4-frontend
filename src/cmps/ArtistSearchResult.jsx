import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'

export function ArtistSearchResult() {
  const artistStations = useSelector(storeState => storeState.searchModule.searchResults)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!artistStations?.length) return <div>Loading...</div>

  function onGoToStation(station) {
    dispatch({ type: SET_STATION, station })
    navigate(`/songlist/${station._id}`)
  }

  function onSetSong(song) {
    dispatch({ type: SET_SONG, song })
    dispatch({ type: SET_IS_PLAYING, isPlaying: true })
  }

  const topArtist = artistStations[0]
  const topSongs = topArtist.songs.slice(0, 4)
  return (
    <section className="header-search-stations">
      <div className="top-result-grid">
        <div className="heading-col">
          <h1>Top Result</h1>
        </div>
        <div className="heading-col">
          <h3>Songs</h3>
        </div>

        <div className="artist-preview" onClick={() => onSetSong(topArtist.song)}>
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
              <li key={song._id} className="song-preview flex align-center" onClick={() => onSetSong(song)}>
                <img src={song.imgUrl} alt={song.title} />
                <div className="song-info">
                  <span className="song-name">{song.title}</span>
                  <span className="artist-name">{topArtist.createdBy.fullname}</span>
                </div>
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
                <span className="artist-title" title={station.name}>{station.name}</span>
                <span className="artist-meta">Artist</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  )
}
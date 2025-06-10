import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { useNavigate } from 'react-router'
import { StationPreview } from './StationPreview'

export function GenreSearchResult() {
  const stations = useSelector(storeState => storeState.searchModule.searchResults)
  const genre = useSelector(storeState => storeState.searchModule.searchText)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!stations?.length) return <section>Loading...</section>

  function onSetSong(song) {
    dispatch({ type: SET_SONG, song })
    dispatch({ type: SET_IS_PLAYING, isPlaying: true })
  }

  function onGoToStation(station) {
    dispatch({ type: SET_STATION, station })
    navigate(`/songlist/${station._id}`)
  }

  return (
    <section className="genre-search-result">
      <div className="genre-header">
        <h1 className="genre-title">{genre}</h1>
      </div>

      <section className="songlist-section">
        <h2>Popular {genre} songlists</h2>

        <div className="station-list">
          <div className="grid-container">
            {stations.map(station => (
              <StationPreview key={station._id} station={station} goToStation={() => onGoToStation(station)} />
            ))}
          </div>
        </div>
      </section>

      <section className="new-releases-section">
        <h2>{genre} New Releases</h2>
        <div>
          {stations
            .flatMap(station => station.songs)
            .slice(0, 10)
            .map((song, idx) => (
              <div key={song._id + '-' + idx} className="song-card" onClick={() => onSetSong(song)}>
                <img src={song.imgUrl} alt={song.title} />
                <button className="play-btn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                  </svg>
                </button>
                <h4>{song.title}</h4>
              </div>
            ))}
        </div>
      </section>
    </section>
  )
}

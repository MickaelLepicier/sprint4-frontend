import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { DominantColorExtractor } from './DominantColorExtractor'
import { useNavigate } from 'react-router'
import { StationPreview } from './StationPreview'
import { addStation } from '../store/station/station.actions'
import { stationService } from '../services/station/station.service.local.js'
import { cleanTitle } from '../services/util.service'
import { SidebarPlayBtn } from './Sidebar/SidebarPlayBtn.jsx'
import { SongCard } from './SongCard.jsx'
import equalizerGif from '/src/assets/img/equalizer.gif'

export function GenreSearchResult() {
  const stations = useSelector(storeState => storeState.searchModule.searchResults)
  const genre = useSelector(storeState => storeState.searchModule.searchText)

  const genreColor = stationService.getGenreColorByName(genre)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMoreGenre, setShowMoreGenre] = useState(false)
  const [showMoreSongs, setShowMoreSongs] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const songListRef = useRef()

  useEffect(() => {
    if (showMoreSongs && songListRef.current) {
      songListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showMoreSongs])

  useEffect(() => {
    setIsLoading(true)
  }, [genre])

    useEffect(() => {
    if (stations?.length) {
      setIsLoading(false)
    }
  }, [stations])

  // if (!stations?.length) return <section>Loading...</section>

  async function onGoToStation(station) {
    const savedStation = await addStation(station)
    navigate(`/playlist/${savedStation._id}`)
  }

  const visibleSongs = stations
    .flatMap(station => station.songs || [])
    .filter(song => song && song.imgUrl)
    .slice(0, showMoreSongs ? 12 : 6)

  console.log(visibleSongs)

  if (isLoading) {
    return (
      <div className="loader-overlay">
        <img className="loader-gif" src={equalizerGif} alt="Loading..." />
      </div>
    )
  }

  return (
    <section className="genre-search-result">
      <div
        className="genre-header"
        style={{
          backgroundColor: `${genreColor}`,
          backgroundImage: `linear-gradient(transparent 0%, rgba(0, 0, 0, 0.5) 100%)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          boxShadow: `0 1px 232px 0 ${genreColor}`,
        }}
      >
        <h1 className="genre-title">{genre}</h1>
      </div>

      <div className="genre-content-container">
        <div className="infinite-scroll-list">
          <section className="songlist-section">
            <div className="songlist-section-header">
              <div className="title-wrapper">
                <h2 className="row-title">Popular {genre} Playlists</h2>
              </div>
              <span
                onClick={() => {
                  setShowMoreGenre(!showMoreGenre)
                }}
              >
                {/* {showMoreGenre ? 'Show less' : 'Show More'} */}
              </span>
            </div>

            <div className="station-list">
              <div className="grid-container">
                {stations.map(station => (
                  <StationPreview key={station._id} station={station} goToStation={onGoToStation} />
                ))}
              </div>
            </div>
          </section>

          <section className="new-releases-section">
            <div className="new-releases-header">
              <div className="title-wrapper">
                <h2 className="row-title">{genre} New Releases</h2>
                <span
                  onClick={() => {
                    setShowMoreSongs(!showMoreSongs)
                  }}
                >
                  {showMoreSongs ? 'Show less' : 'Show More'}
                </span>
              </div>
            </div>

            <div ref={songListRef} className={`song-list${showMoreSongs ? ' expanded' : ''}`}>
              <div className="grid-container">
                {visibleSongs.map((song, idx) => (
                  <SongCard key={song.id + '-' + idx} song={song} idx={idx} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { stationService } from '../services/station'
import { showErrorMsg } from '../services/event-bus.service'
import { useDispatch, useSelector } from 'react-redux'
import { StationPreview } from '../cmps/StationPreview'
import { SET_STATION } from '../store/station/station.reducer'
import { WideStationPreview } from '../cmps/WideStationPreview'
import { addStation, loadStations } from '../store/station/station.actions'
import { FastAverageColor } from 'fast-average-color'
import { getApproximateSpotifyColor } from '../services/util.service'
import { StationShelf } from '../cmps/StationShelf'

import equalizerGif from '/src/assets/img/equalizer.gif'

export function HomePage() {
  const [apiStations, setApiStations] = useState([])
  const stations = useSelector(state => state.stationModule.stations)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showMoreTopMixes, setShowMoreTopMixes] = useState(true)
  const [showMoreRecommended, setShowMoreRecommended] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const user = useSelector(state => state.userModule.user)

  const [gradientStyle, setGradientStyle] = useState({})
  const [imgHover, setImgHover] = useState(null)
  const firstStationColor = useRef(null)
  const filters = ['All', 'Music', 'Podcasts']
  const fac = new FastAverageColor()

  const [active, setActive] = useState('All')
  // Local loader state
  const [isHomeLoading, setIsHomeLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!stations.length) dispatch(loadStations())
    // eslint-disable-next-line
  }, [stations.length])

  useEffect(() => {
    if (!apiStations.length) return

    const firstImgUrl = apiStations.slice(0, 8).find(apiStation => apiStation.imgUrl)?.imgUrl
    if (!firstImgUrl) return

    fac
      .getColorAsync(firstImgUrl)
      .then(color => (firstStationColor.current = getApproximateSpotifyColor(color.hex)))
      .catch(err => console.error('Error getting first station color', err))
    // eslint-disable-next-line
  }, [apiStations])

  useEffect(() => {
    if (!imgHover) {
      if (firstStationColor.current) {
        setGradientStyle({ backgroundColor: firstStationColor.current })
      }
      return
    }

    fac
      .getColorAsync(imgHover)
      .then(color => {
        const spotifyRGB = getApproximateSpotifyColor(color.hex)
        setGradientStyle({ backgroundColor: spotifyRGB })
      })
      .catch(err => console.error('Error getting color from image', err))
    // eslint-disable-next-line
  }, [imgHover])

  async function loadHomeData() {
    try {
      setIsHomeLoading(true)
      const res = await stationService.getHomeSearchContent()
      setApiStations(res)
    } catch (error) {
      showErrorMsg('Failed to bring data')
    } finally {
      setIsHomeLoading(false)
    }
  }

  async function onGoToStation(station) {
    if (!user) {
      dispatch({ type: SET_STATION, station })
      navigate(`/playlist/${station._id}`)
    } else {
      const returnedStation = await addStation(station)
      dispatch({ type: SET_STATION, returnedStation })
      navigate(`/playlist/${returnedStation._id}`)
    }
  }

  function genreStations(tag) {
    return stations.filter(station => station.tags?.includes(tag))
  }

  const headerStations = apiStations.slice(0, 8)
  const remainingStations = apiStations.slice(8)
  const mid = Math.ceil(remainingStations.length / 2)
  const topMixes = remainingStations.slice(0, mid)
  const recommended = remainingStations.slice(mid)

  if (isHomeLoading) {
    return (
      <div className="loader-overlay">
        <img className="loader-gif" src={equalizerGif} alt="Loading..." />
      </div>
    )
  }

  return (
    <section className="home-page">
      <div className="home-gradient" style={gradientStyle}></div>

      <div className="home-filter">
        <div className="group-filter-btns">
          {filters.map(filter => (
            <button
              key={filter}
              className={`group-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              <span>{filter}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="home-page-container">
        <div className="content-spacing">
          <section className="home-header-stations">
            <div className="header-station-list">
              {headerStations.map(station => (
                <WideStationPreview
                  key={station._id}
                  station={station}
                  goToStation={onGoToStation}
                  setImgHover={setImgHover}
                />
              ))}
            </div>
          </section>

          {/* Top Mixes */}
          <StationShelf title="Top Mixes" stations={topMixes} goToStation={onGoToStation} />

          {/* Recommended */}
          <StationShelf title="Recommended Stations" stations={recommended} goToStation={onGoToStation} />

          {/* Genres */}
          <StationShelf title={`Rock 'n fuckin' Roll`} stations={genreStations('Rock')} goToStation={onGoToStation} />
          <StationShelf title="Pop Pop Skibidi" stations={genreStations('Pop')} goToStation={onGoToStation} />
          <StationShelf
            title="Hip Hop aka Wanna be White music"
            stations={genreStations('Hip Hop')}
            goToStation={onGoToStation}
          />
          <StationShelf
            title="Latin - WtF nobdy listn dis"
            stations={genreStations('Latin')}
            goToStation={onGoToStation}
          />
          <StationShelf
            title="Electroniczzzzzzzzzz"
            stations={genreStations('Electronic')}
            goToStation={onGoToStation}
          />
          <StationShelf
            title="Alternative yawnayawn"
            stations={genreStations('Alternative')}
            goToStation={onGoToStation}
          />
        </div>
      </div>
    </section>
  )
}

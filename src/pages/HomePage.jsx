import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { stationService } from '../services/station'
import { showErrorMsg } from '../services/event-bus.service'
import { useDispatch } from 'react-redux'
import { StationPreview } from '../cmps/StationPreview'
import { SET_STATION } from '../store/station/station.reducer'
import { WideStationPreview } from '../cmps/WideStationPreview'
import { addStation } from '../store/station/station.actions'
import { FastAverageColor } from 'fast-average-color'
// import { enhanceColor } from '../services/util.service' 
import { getApproximateSpotifyColor } from '../services/util.service' 

export function HomePage() {
  const [stations, setStations] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showMoreTopMixes, setShowMoreTopMixes] = useState(true)
  const [showMoreRecommended, setShowMoreRecommended] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const [gradientStyle, setGradientStyle] = useState({})
  const [imgHover, setImgHover] = useState(null)
  const firstStationColor = useRef(null)
  const filters = ['All', 'Music', 'Podcasts']
  const fac = new FastAverageColor()


  const [active, setActive] = useState('All')

  useEffect(() => {
    loadHomeData()
  }, [])

  useEffect(() => {
    if (!stations.length) return

    const firstImgUrl = stations.slice(0, 8).find(station => station.imgUrl)?.imgUrl
    if (!firstImgUrl) return

    fac.getColorAsync(firstImgUrl)
        .then(color => firstStationColor.current = getApproximateSpotifyColor(color.hex))
        .catch(err => console.error('Error getting first station color', err))
  }, [stations])

  useEffect(() => {
    if (!imgHover) {
        if (firstStationColor.current) {
            setGradientStyle({ backgroundColor: firstStationColor.current })
        }
        return
    }

    fac.getColorAsync(imgHover)
        .then(color => {
            const spotifyRGB = getApproximateSpotifyColor(color.hex)
            setGradientStyle({ backgroundColor: spotifyRGB })
        })
        .catch(err => console.error('Error getting color from image', err))
  }, [imgHover])


  // useEffect(() => {
  //   if (!imgHover) return

  //   fac.getColorAsync(imgHover)
  //     .then(color => {
  //       const brightColor = enhanceColor(color.hex, 0.4, 1.8)
  //       console.log('Bright color rgb:', brightColor)
  //       setGradientStyle({
  //         backgroundImage: `linear-gradient(to bottom, ${brightColor} 10%, #121212 100%)`
  //       })
  //     })
  //     .catch(err => console.error('Error getting color from image', err))
  // }, [imgHover])

  async function loadHomeData() {
    try {
      const res = await stationService.getHomeSearchContent()
      setStations(res)
    } catch (error) {
      console.log('error:', error)
      showErrorMsg('Failed to bring data')
    }
  }

  async function onGoToStation(station) {
    await addStation(station)
    navigate(`/playlist/${station._id}`)
  }

  const headerStations = stations.slice(0, 8)
  const remainingStations = stations.slice(6)
  const mid = Math.ceil(remainingStations.length / 2)
  const topMixes = remainingStations.slice(0, mid)
  const recommended = remainingStations.slice(mid)

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
      <section className="home-top-mixes">
        <div className="top-mixes-header">
          <h1 className="top-mixes-h1">Top Mixes</h1>
          <span
            onClick={() => {
              setShowMoreTopMixes(!showMoreTopMixes)
            }}
          >
            {showMoreTopMixes ? 'Show All' : 'Show Less'}
          </span>
        </div>
        <div className="home-mixes-list">
          {showMoreTopMixes
            ? topMixes
                .map(station => <StationPreview key={station._id} station={station} goToStation={onGoToStation} />)
                .slice(0, 7)
            : topMixes.map(station => (
                <StationPreview key={station._id} station={station} goToStation={onGoToStation} />
              ))}
        </div>
      </section>
      <section className="home-recommended">
        <div className="top-recommended-header">
          <h1 className="top-recommended-h1">Recommended Stations</h1>
          <span
            onClick={() => {
              setShowMoreRecommended(!showMoreRecommended)
            }}
          >
            {showMoreRecommended ? 'Show All' : 'Show Less'}
          </span>
        </div>
        <div className="recommended-station-list">
          {showMoreRecommended
            ? recommended
                .map(station => <StationPreview key={station._id} station={station} goToStation={onGoToStation} />)
                .slice(0, 7)
            : recommended.map(station => (
                <StationPreview key={station._id} station={station} goToStation={onGoToStation} />
              ))}
        </div>
      </section>
    </section>
  )
}

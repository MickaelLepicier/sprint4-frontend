import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { stationService } from '../services/station'
import { showErrorMsg } from '../services/event-bus.service'
import { useDispatch } from 'react-redux'
import { StationPreview } from '../cmps/StationPreview'
import { SET_STATION } from '../store/station/station.reducer'
import { WideStationPreview } from '../cmps/WideStationPreview'
import { addStation } from '../store/station/station.actions'

export function HomePage() {
  const [stations, setStations] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showMoreTopMixes, setShowMoreTopMixes] = useState(true)
  const [showMoreRecommended, setShowMoreRecommended] = useState(true)

  const [active, setActive] = useState('All')

  useEffect(() => {
    loadHomeData()
  }, [])

  async function loadHomeData() {
    try {
      const res = await stationService.getHomeSearchContent()
      setStations(res)
    } catch (error) {
      console.log('error:', error)
      showErrorMsg('Failed to bring data')
    }
  }

  function onGoToStation(station) {
    addStation(station)
    navigate(`/playlist/${station._id}`)
  }

  const headerStations = stations.slice(0, 6)
  const remainingStations = stations.slice(6)
  const mid = Math.ceil(remainingStations.length / 2)
  const topMixes = remainingStations.slice(0, mid)
  const recommended = remainingStations.slice(mid)

  return (
    <section className="home-page">
      {/* Commented until will work filter */}
      {/* <div className="home-filter">
        <span className={active === 'All' ? 'active' : ''} onClick={() => setActive('All')}>
          All
        </span>
        <span className={active === 'Music' ? 'active' : ''} onClick={() => setActive('Music')}>
          Music
        </span>
        <span className={active === 'Podcasts' ? 'active' : ''} onClick={() => setActive('Podcasts')}>
          Podcasts
        </span>
      </div> */}
      <section className="home-header-stations">
        <div className="header-station-list">
          {headerStations.map(station => (
            <WideStationPreview key={station._id} station={station} goToStation={onGoToStation} />
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

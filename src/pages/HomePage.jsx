import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { stationService } from '../services/station'
import { showErrorMsg } from '../services/event-bus.service'
import { useDispatch } from 'react-redux'
import { StationPreview } from '../cmps/StationPreview'
import { SET_STATION } from '../store/station/station.reducer'
import { WideStationPreview } from '../cmps/WideStationPreview'

export function HomePage() {
  const [stations, setStations] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
    dispatch({ type: SET_STATION, station })
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
        <h1 className="top-mixes-h1">Top Mixes</h1>
        <div className="home-mixes-list">
          {topMixes.map(station => (
            <StationPreview key={station._id} station={station} goToStation={onGoToStation} />
          ))}
        </div>
      </section>
      <section className="home-recommended">
        <h1 className="top-recommended-h1">Recommended Stations</h1>
        <div className="recommended-station-list">
          {recommended.map(station => (
            <StationPreview key={station._id} station={station} goToStation={onGoToStation} />
          ))}
        </div>
      </section>
    </section>
  )
}

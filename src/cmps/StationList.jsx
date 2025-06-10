import { useDispatch } from 'react-redux'
import { userService } from '../services/user'
import { StationPreview } from './StationPreview'
import { useNavigate } from 'react-router'
import { SET_STATION } from '../store/station/station.reducer'

export function StationList({ stations, onRemoveStation, onUpdateStation }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()



  function shouldShowActionBtns(station) {
    const user = userService.getLoggedinUser()
    if (!user) return false
    if (user.isAdmin) return true
    return station.owner?._id === user._id
  }

  function onGoToStation(station) {
    dispatch({ type: SET_STATION, station })
    navigate(`/songlist/${station._id}`)
  }

  return (
    <section>
      <section className="station-list">
        <div className="grid-container">
          {stations.map(station => (
            <li key={station._id}>
              <StationPreview station={station} goToStation={onGoToStation} />
              {shouldShowActionBtns(station) && (
                <div className="actions">
                  <button onClick={() => onUpdateStation(station)}>Edit</button>
                  <button onClick={() => onRemoveStation(station._id)}>x</button>
                </div>
              )}
            </li>
          ))}
        </div>
      </section>
    </section>
  )
}

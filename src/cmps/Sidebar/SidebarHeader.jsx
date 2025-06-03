import { useState } from 'react'
import { CreateIcon } from '../svg/CreateIcon'
import { stationService } from '../../services/station'
import { useNavigate } from 'react-router'
import { addStation } from '../../store/station/station.actions'

export function SidebarHeader() {
  const [emptyStation, setEmptyStation] = useState(stationService.getEmptyStation())
  const navigate = useNavigate()


  async function onCreateStation() {
    const stationToSave = emptyStation
    try {
      const savedStation = await addStation(stationToSave)
      console.log('savedStation:',savedStation)
      navigate(`/playlist/${savedStation._id}`)
    } catch (error) {}
  }

  return (
    <header className="sidebar-header">
      <div className="header-actions">
        <h1>Your Library</h1>
        <button className="create-btn" aria-label="Create playlist or folder" onClick={onCreateStation}>
          <span className="icon">
            <CreateIcon />
          </span>
          <span className="label">Create</span>
        </button>
      </div>
    </header>
  )
}

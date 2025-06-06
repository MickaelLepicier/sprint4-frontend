// import { useState } from 'react'
import { CreateIcon } from '../svg/CreateIcon'
// import { stationService } from '../../services/station'
// import { useNavigate } from 'react-router'
// import { addStation } from '../../store/station/station.actions'
// import { showErrorMsg } from '../../services/event-bus.service'


export function SidebarHeader({ onCreateStation }) {
  // const [emptyStation, setEmptyStation] = useState(stationService.getEmptyStation())
  // const navigate = useNavigate()

  // ************************************************************
  // ***** THIS LOGIC IS DISABLED *****
  // Was used to auto-name songlists like "New SongList #1"
  // No longer needed because the following features will be implemented:
  // * Users can rename songlists
  // * SongLists can be manually reordered (drag & drop)
  // --> We just create a blank songlist now

  // async function onCreateStation() {
  //   try {
  //     const allStations = await stationService.query()

  //     const usedNums = allStations
  //       .map(station => {
  //         const match = station.name.match(/^New SongList #(\d+)$/)
  //         return match ? +match[1] : null
  //       })
  //       .filter(num => num !== null)
  //       .sort((a, b) => a - b)

  //     let nextNum = 1
  //     for (const num of usedNums) {
  //       if (num === nextNum) nextNum++
  //       else break
  //     }

  //     const newStation = {
  //       ...emptyStation,
  //       name: `New SongList #${nextNum}`,
  //     }

  //     const savedStation = await addStation(newStation)

  //     navigate(`/songlist/${savedStation._id}`)
  //   } catch (error) {
  //     showErrorMsg('Error creating new album')
  //   }
  // }
  // ************************************************************

  return (
    <header className="sidebar-header">
      <div className="header-actions">
        <h1>Your Library</h1>
        <button className="create-btn" aria-label="Create songlist or folder" onClick={onCreateStation}>
          <span className="icon">
            <CreateIcon />
          </span>
          <span className="label">Create</span>
        </button>
      </div>
    </header>
  )
}

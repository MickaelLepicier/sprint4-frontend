import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { loadStations, createStationForUser } from '../../store/station/station.actions'

import { SidebarHeader } from './SidebarHeader'
import { SidebarViewFilter } from './SidebarViewFilter'
import { SidebarFilterSort } from './SidebarFilterSort'
import { SidebarList } from './SidebarList'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'

export function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  const stations = useSelector(state => state.stationModule.stations)
  const user = useSelector(state => state.userModule.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!stations.length) loadStations()
  }, [stations.length])

  const filteredStations = useMemo(() => {
    if (!user) return []

    const regex = new RegExp(searchTerm, 'i')
    const userId = user._id
    const likedStationIds = new Set(user.likedStationIds)

    const result = {
      likedSongs: [],
      created: [],
      liked: [],
    }

    for (const station of stations) {
      if (!regex.test(station.name)) continue

      const isLikedSongsStation = station._id === user.likedSongsStationId

      if (isLikedSongsStation && station.songs?.length > 0) {
        result.likedSongs.push(station)
      } else if (station.createdBy?._id === userId && !isLikedSongsStation) {
        result.created.push(station)
      } else if (likedStationIds.has(station._id)) {
        result.liked.push(station)
      }
    }

    return [...result.likedSongs, ...result.created, ...result.liked]
  }, [stations, user, searchTerm])

  async function onCreateStation() {
    if (!user) {
      showErrorMsg('Please log in to create a songlist')
      return
    }

    try {
      const savedStation = await createStationForUser(user)
      showSuccessMsg('New songlist created!')

      await loadStations()

      navigate(`/playlist/${savedStation._id}`)
    } catch (err) {
      showErrorMsg('Failed to create songlist')
    }
  }

  function onToggleCollapse() {
    setIsCollapsed(prevIsCollapsed => !prevIsCollapsed)
  }

  return (
    <aside
      className={`sidebar${isCollapsed ? ' collapsed' : ''}`}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <SidebarHeader
        onCreateStation={onCreateStation}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        isSidebarHovered={isSidebarHovered}
      />

      {user && (
        <>
          {/* Only show playlist/arists filter when expanded */}
          {!isCollapsed && <SidebarViewFilter />}

          <div className="library-container">
            {/* Only show search bar & sort when expanded */}
            {!isCollapsed && <SidebarFilterSort searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}

            <SidebarList
              stations={filteredStations}
              isCollapsed={isCollapsed}
              user={user}
            />
          </div>
        </>
      )}
    </aside>
  )
}

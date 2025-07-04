import { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { loadStations, createStationForUser } from '../../store/station/station.actions'

import { SidebarHeader } from './SidebarHeader'
import { SidebarViewFilter } from './SidebarViewFilter'
import { SidebarFilterSort } from './SidebarFilterSort'
import { SidebarList } from './SidebarList'
import { useCompactCreateBtn } from '../../hooks/useCompactCreateBtn'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'

export function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  const stations = useSelector(state => state.stationModule.stations)
  const user = useSelector(state => state.userModule.user)
  const navigate = useNavigate()

  const sidebarRef = useRef()
  const isCompactCreateBtn = useCompactCreateBtn(sidebarRef, 331)

  useEffect(() => {
    if (!stations.length) loadStations()
  }, [stations.length])

  const filteredStations = useMemo(() => {
    if (!user) return []

    const searchWords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const userId = user._id
    const likedStationIds = new Set(user.likedStationIds)

    const result = {
      likedSongs: [],
      created: [],
      liked: [],
    }

    for (const station of stations) {
      const name = (station.name || '').toLowerCase()
      const matches = searchWords.every(word => name.includes(word))
      if (!matches) continue

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
  } , [stations, user, searchTerm])

  async function onCreateStation() {
    if (!user) {
      showErrorMsg('Please log in to create a songlist')
      return
    }

    try {
      const savedStation = await createStationForUser(user)
      showSuccessMsg('Added to Your Library')

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
      ref={sidebarRef}
      className={`sidebar${isCollapsed ? ' collapsed' : ''}`}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <SidebarHeader
        onCreateStation={onCreateStation}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        isSidebarHovered={isSidebarHovered}
        isCompactCreateBtn={isCompactCreateBtn}
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

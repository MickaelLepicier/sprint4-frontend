import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { loadStations } from '../../store/station/station.actions'
import { createStationForUser } from '../../store/station/station.actions'

import { SidebarHeader } from './SidebarHeader'
import { SidebarViewFilter } from './SidebarViewFilter'
import { SidebarFilterSort } from './SidebarFilterSort'
import { SidebarList } from './SidebarList'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'

export function Sidebar() {
    const stations = useSelector(state => state.stationModule.stations)
    const user = useSelector(state => state.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (!stations.length) loadStations()
    }, [stations.length])

    const likedStations = user ? stations.filter(s => user.likedStationIds.includes(s._id)) : []

    const userStations = user ? stations.filter(s => s.createdBy?._id === user._id) : []

    const likedSongsStation = stations.find(s => s._id === user?.likedSongsStationId)
    const likedSongsCount = likedSongsStation?.songs?.length || 0

    async function onCreateStation() {
        if (!user) {
            showErrorMsg('Please log in to create a songlist')
            return
        }

        try {
            const savedStation = await createStationForUser(user)

            showSuccessMsg('New songlist created!')
            navigate(`/songlist/${savedStation._id}`)
        } catch (err) {
            showErrorMsg('Failed to create songlist')
        }
    }

    return (
        <aside className="sidebar">
            <SidebarHeader onCreateStation={onCreateStation}/>

            <SidebarViewFilter />
            
            <div className="library-container">
                <SidebarFilterSort />
                
                <SidebarList
                    userStations={userStations}
                    likedStations={likedStations}
                    likedSongsCount={likedSongsCount}
                    likedSongsStationId={user?.likedSongsStationId}
                    user={user}
                />
            </div>
        </aside>
    )
}

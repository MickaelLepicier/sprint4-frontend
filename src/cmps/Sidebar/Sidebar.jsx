import { useEffect, useState } from 'react'
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

    // Reserverd for future filter when refactoring the entire component
    function filterStations(stationsArr) {
        if (!searchTerm.trim()) return stationsArr
        const regex = new RegExp(searchTerm, 'i')
        return stationsArr.filter(station => regex.test(station.name))
    }

    const regex = new RegExp(searchTerm, 'i')

    // Stations added  by user to his library
    // const likedStations = user ? stations.filter(s => user.likedStationIds.includes(s._id)) : []
    const likedStations = user ? stations.filter(s =>user.likedStationIds.includes(s._id) && regex.test(s.name)) : []

    // Stations the user created (*** DOES NOT INCLUDE THE LIKED SONGS STATION! ***)
    // const userStations = user
    //     ? stations.filter(s => s.createdBy?._id === user._id && s._id !== user.likedSongsStationId)
    //     : []
    const userStations = user ? stations.filter(s => s.createdBy?._id === user._id && s._id !== user.likedSongsStationId && regex.test(s.name)) : []

    // Stations that contains all the songs the user has liked
    // Station shows/hides according if there are any songs in it
    // const likedSongsStation = stations.find(s => s._id === user?.likedSongsStationId)
    const likedSongsStation = stations.find(s => s._id === user?.likedSongsStationId && regex.test(s.name))
    const likedSongsCount = likedSongsStation?.songs?.length || 0

    async function onCreateStation() {
        if (!user) {
        showErrorMsg('Please log in to create a songlist')
        return
        }

        try {
            const savedStation = await createStationForUser(user)
            showSuccessMsg('New songlist created!')

            await loadStations()
            
            navigate(`/songlist/${savedStation._id}`)
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
                    { !isCollapsed && <SidebarViewFilter /> }
                    
                    <div className="library-container">
                        {/* Only show search bar & sort when expanded */}
                        { !isCollapsed && <SidebarFilterSort 
                                                searchTerm={searchTerm} 
                                                setSearchTerm={setSearchTerm} 
                                          /> }
                        
                        <SidebarList
                            userStations={userStations}
                            likedStations={likedStations}
                            likedSongsStation={likedSongsStation}
                            likedSongsCount={likedSongsCount}
                            likedSongsStationId={user?.likedSongsStationId}
                            user={user}
                            isCollapsed={isCollapsed}
                        />
                    </div>
                </>
            )}
        </aside>
    )
}

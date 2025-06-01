import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadStations } from '../../store/station/station.actions'

import { SidebarHeader } from './SidebarHeader'
import { SidebarViewFilter } from './SidebarViewFilter'
import { SidebarFilterSort } from './SidebarFilterSort'
import { SidebarList } from './SidebarList'

export function Sidebar() {
    const stations = useSelector(state => state.stationModule.stations)
    // const user = useSelector(state => state.userModule.user)

    useEffect(() => {
        if (!stations.length) loadStations()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const likedStations = stations.filter(station =>
    //     user?.likedStationIds.includes(station._id)
    // )

    // const userStations = stations.filter(station =>
    //     station.createdBy._id === user?._id
    // )

    return (
        <aside className="sidebar">
            <SidebarHeader />
            <SidebarViewFilter />
            <div className="library-container">
                <SidebarFilterSort />
                <SidebarList
                    // likedStations={likedStations}
                    // userStations={userStations}
                    stations={stations}
                />
            </div>
        </aside>
    )
}

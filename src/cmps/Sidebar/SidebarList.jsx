import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SidebarLikedSongs } from './SidebarLikedSongs'
import { SidebarPreview } from './SidebarPreview'

export function SidebarList({
    userStations = [],
    likedStations = [],
    likedSongsCount = 0,
    likedSongsStationId,
    user
}) {
    const navigate = useNavigate()
    const [selectedStationId, setSelectedStationId] = useState(null)

    useEffect(() => {
        if (likedSongsStationId) {
            setSelectedStationId(likedSongsStationId)
        }
    }, []) 

    // Combine user's own created songlists with liked songlists, Skip the 'Liked Songs' station of the user
    // and mark (pin) liked ones with isPinned: true (reserved for future use)
    const allStationsToShow = 
        [ ...userStations, ...likedStations]
            .filter(st => st._id !== likedSongsStationId)
            // .map(st => ({ ...st, isPinned: user?.pinnedStationIds?.includes(station._id) }))

    function onClickSonglist(stationId) {
        setSelectedStationId(stationId)
        navigate(`songlist/${stationId}`)
    }

    return (
        <section className="sidebar-list">
            <ul>
                {/* User's liked songs */}
                {likedSongsCount > 0 && likedSongsStationId && (
                    <SidebarLikedSongs 
                        likedSongsCount={likedSongsCount} 
                        likedSongsStationId={likedSongsStationId}
                        isSelected={selectedStationId === likedSongsStationId}
                        onClickSonglist={onClickSonglist}
                    />
                )}

                {/* All songlists: user's and liked */}
                {allStationsToShow.map(station => (
                    <SidebarPreview
                        key={station._id}
                        songlist={{
                            title: station.name,
                            imgUrl: station.imgUrl,
                            songCount: station.songs.length,
                            _id: station._id,
                            isLiked: !!station.isLiked,
                            createdById: station.createdBy?._id
                        }}
                        isSelected={selectedStationId === station._id}
                        onClickSonglist={onClickSonglist}
                        userFirstName={user?.fullname?.split(' ')[0]}
                        userId={user._id}
                    />
                ))}
            </ul>
        </section>
    )
}

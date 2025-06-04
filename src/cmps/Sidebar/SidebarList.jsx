import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SidebarLikedSongs } from './SidebarLikedSongs'
import { SidebarPreview } from './SidebarPreview'

export function SidebarList({
    userStations = [],
    likedStations = [],
    likedSongsCount = 0,
    likedSongsStationId
}) {
    const navigate = useNavigate()
    const [selectedStationId, setSelectedStationId] = useState(null)

    useEffect(() => {
        if (likedSongsStationId) {
            setSelectedStationId(likedSongsStationId)
        }
    }, []) 

    // Combine user's own created playlists with liked playlists, Skip the 'Liked Songs' station of the user
    // and mark (pin) liked ones with isPinned: true (reserved for future use)
    const allStationsToShow = 
        [ ...userStations, ...likedStations]
            .filter(st => st._id !== likedSongsStationId)
            // .map(st => ({ ...st, isPinned: user?.pinnedStationIds?.includes(station._id) }))

    function onClickPlaylist(stationId) {
        setSelectedStationId(stationId)
        navigate(`playlist/${stationId}`)
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
                        onClickPlaylist={onClickPlaylist}
                    />
                )}

                {/* All playlists: user's and liked */}
                {allStationsToShow.map(station => (
                    <SidebarPreview
                        key={station._id}
                        playlist={{
                            title: station.name,
                            imgUrl: station.imgUrl,
                            songCount: station.songs.length,
                            _id: station._id,
                            isLiked: !!station.isLiked
                        }}
                        isSelected={selectedStationId === station._id}
                        onClickPlaylist={onClickPlaylist}
                    />
                ))}
            </ul>
        </section>
    )
}

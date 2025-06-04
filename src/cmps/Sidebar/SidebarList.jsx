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

    // Combine user's own created playlists with liked playlists, and mark liked ones with isLiked: true
    const allStationsToShow = [
        ...userStations,
        ...likedStations.map(s => ({ ...s, isLiked: true }))
    ]

    function onClickPlayList(id) {
        navigate(`playlist/${id}`)
    }

    return (
        <section className="sidebar-list">
            <ul>
                {/* User's liked songs */}
                {likedSongsCount > 0 && user?.likedSongsStationId && (
                    <SidebarLikedSongs 
                        songCount={likedSongsCount} 
                        onClickPlayList={onClickPlayList}
                        likedSongsStationId={likedSongsStationId}
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
                        onClickPlayList={onClickPlayList}
                    />
                ))}
            </ul>
        </section>
    )
}

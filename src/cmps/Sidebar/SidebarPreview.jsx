import { useState } from 'react'
import { useSelector } from 'react-redux'

import { ImageWithFallback } from '../util/ImageWithFallBack'

import likedSongsImg  from '../../assets/img/liked-songs.png'
import { PinIcon } from '../svg/PinIcon'
import { EmptyPlaylistIcon } from '../svg/EmptyPlaylistIcon' 
import { PlayIcon } from '../svg/PlayIcon' 
import { stationReducer } from '../../store/station/station.reducer'

export function SidebarPreview({ 
    songlist, 
    onClickSonglist, 
    isSelected, 
    userFirstName, 
    userId,
    isCollapsed,
    setDragRef,
    isLikedSongs = false,
    isOver
}) {
    // const [isHovered, setIsHovered] = useState(true)
    // const currentStationId = useSelector(state => state.stationModule.station?._id)
    // const isPlaying = songlist._id === currentStationId
    const currentStationId = useSelector(state => state.stationModule.currentStation?._id)
    const isPlaying = songlist._id === currentStationId

    const path = "m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"

    function getClassName() {
        let className = 'sidebar-preview'
        if (isSelected) className += ' selected'
        if (isLikedSongs) className += ' liked-songs'
        if (isPlaying) className += ' playing'
        // if (isPlaying) className += ' playing'
        // if (isPlaying) console.log('STATION!!!', songlist.title)
        return className
    }

    // Returns the subtitle based on station type and ownership
    function getSubtitle() {
        const { songCount } = songlist
        const playlistPrefix = 'Playlist •'

        if (songlist.createdById === userId) {
            return `${playlistPrefix} ${userFirstName}`
        } else {
            return `${playlistPrefix} ${songCount} ${songCount === 1 ? 'song' : 'songs'}`
        }
    }

    function getImgContent() {
        if (isLikedSongs) {
            return <img src={likedSongsImg} alt="Liked Songs" />
        }
        return (
            <ImageWithFallback
                src={songlist.imgUrl}
                alt={songlist.title}
                fallback={<EmptyPlaylistIcon />}
            />
        )
    }

    return (
        <li
            ref={setDragRef}
            className={`${getClassName()}${isOver ? ' drag-over' : ''}`}
            onClick={() => onClickSonglist(songlist._id)}
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
        >
            <div className="icon-wrapper">
                <div className="img-bg" />
                {getImgContent()}
                <PlayIcon path={path}/>
            </div>
           
            {!isCollapsed && (
                <div className="details">
                    <h3>{isLikedSongs ? 'Liked Songs' : songlist.title}</h3>
                    <p>
                        {isLikedSongs && (
                            <span className="pin-icon"><PinIcon /></span>
                        )}
                        <span className="songs">{getSubtitle()}</span>
                    </p>
                </div>
            )}
        </li>
    )
}

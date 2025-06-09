import { useState } from 'react'

import likedSongsImg  from '../../assets/img/liked-songs.png'
import { PinIcon } from '../svg/PinIcon'
import { EmptyPlaylistIcon } from '../svg/EmptyPlaylistIcon' 
import { ImageWithFallback } from '../util/ImageWithFallBack'

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
    const [isHovered, setIsHovered] = useState(false)

    function getClassName() {
        let className = 'sidebar-preview'
        if (isSelected) className += ' selected'
        if (isLikedSongs) className += ' liked-songs'
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="img-wrapper">
                {getImgContent()}
                {/* {isHovered && (
                    <button className="play-btn" aria-label={`Play ${songlist.title}`}>
                        <PlayIcon />
                    </button>
                )} */}
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

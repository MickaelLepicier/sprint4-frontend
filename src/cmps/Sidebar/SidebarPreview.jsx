import { useState } from 'react'

import likedSongsImg  from '../../assets/img/liked-songs.png'
import { PinIcon } from '../svg/PinIcon'

export function SidebarPreview({ 
    songlist, 
    onClickSonglist, 
    isSelected, 
    userFirstName, 
    userId,
    isCollapsed,
    setDragRef,
    isLikedSongs = false
}) {
    const [isHovered, setIsHovered] = useState(false)

    function getClassName() {
        let className = 'sidebar-preview'
        if (isSelected) className += ' selected'
        if (isLikedSongs) className += ' liked-songs'
        return className
    }

    // Returns the correct image: "Liked Songs" or the station's own image
    function getImgSrc() {
        return isLikedSongs ? likedSongsImg : songlist.imgUrl
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

    return (
        <li
            ref={setDragRef}
            className={getClassName()}
            onClick={() => onClickSonglist(songlist._id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="img-wrapper">
                <img src={getImgSrc()} alt={songlist.title} />
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

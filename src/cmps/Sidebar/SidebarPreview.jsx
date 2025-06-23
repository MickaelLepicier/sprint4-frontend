import { useState, seEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { ImageWithFallback } from '../util/ImageWithFallBack'

import likedSongsImg from '../../assets/img/liked-songs.png'
import { PinIcon } from '../svg/PinIcon'
import { EmptyPlaylistIcon } from '../svg/EmptyPlaylistIcon'
import { PlayIcon } from '../svg/PlayIcon'

export function SidebarPreview({
  station,
  onClickSonglist,
  isSelected,
  user,
  isCollapsed,
  setDragRef,
  isLikedSongs = false,
  isOver,
  onContextMenu
}) {
  const {
    _id,
    name: title,
    imgUrl,
    songs = [],
    createdBy,
  } = station

  const [isHovered, setIsHovered] = useState(false)

  const currentStationId = useSelector(state => state.stationModule.currentStation?._id)
  const isPlaying = _id === currentStationId
  const songCount = songs.length
  const createdById = createdBy?._id
  const userFirstName = user?.fullname?.split(' ')[0]
  const userId = user?._id

  function getClassName() {
    let className = 'sidebar-preview'
    if (isSelected) className += ' selected'
    if (isLikedSongs) className += ' liked-songs'
    if (isPlaying) className += ' playing'
    return className
  }

  function getSubtitle() {
    const playlistPrefix = 'Playlist •'

    if (createdById === userId) {
      return `${playlistPrefix} ${userFirstName}`
    } else {
      return `${playlistPrefix} ${songCount} ${songCount === 1 ? 'song' : 'songs'}`
    }
  }

  function getImgContent() {
    if (isLikedSongs) {
      return <img src={likedSongsImg} alt="Liked Songs" />
    }
    return <ImageWithFallback src={imgUrl} alt={title} fallback={<EmptyPlaylistIcon />} />
  }
        
  return (
    <>
      <section>
        <li
          ref={setDragRef}
          className={`${getClassName()}${isOver ? ' drag-over' : ''}`}
          onClick={() => onClickSonglist(_id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onContextMenu={(ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            onContextMenu(ev, station)
          }}
        >
          <div className="icon-wrapper" >
            {/* <div className="img-bg" /> */}
            {getImgContent()}
            {/* TODO - put PlayBtn functionality */}
            <PlayIcon />
          </div>

          {!isCollapsed && (
            <div className="details">
              <h3>{isLikedSongs ? 'Liked Songs' : title}</h3>
              <p>
                {isLikedSongs && (
                  <span className="pin-icon">
                    <PinIcon />
                  </span>
                )}
                <span className="songs">{getSubtitle()}</span>
              </p>
            </div>
          )}
        </li>      
      </section>

      {isCollapsed && isHovered && (
        <div className="preview-hover-label">
          <div className="preview-info">
            <p className="title">{isLikedSongs ? 'Liked Songs' : title}</p>
            <p className="songs">{getSubtitle()}</p>
          </div>
        </div>
      )}
    </>

  )
}

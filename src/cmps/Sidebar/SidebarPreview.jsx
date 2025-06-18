import { useEffect, useRef } from 'react'
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
  userFirstName,
  userId,
  isCollapsed,
  setDragRef,
  isLikedSongs = false,
  isOver,
  contextMenu,
  setContextMenu,
  initialContextMenu,
  onDeleteStation,
}) {
  const {
    _id,
    name: title,
    imgUrl,
    songs = [],
    createdBy,
  } = station

  const currentStationId = useSelector(state => state.stationModule.currentStation?._id)
  const isPlaying = _id === currentStationId
  const songCount = songs.length
  const createdById = createdBy?._id

  const menuRef = useRef()

  useEffect(() => {
    function handleClickOutside(ev) {
      if (contextMenu.show && menuRef.current && !menuRef.current.contains(ev.target)) {
        setContextMenu(initialContextMenu)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [contextMenu])

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

  function handleStationMenu(ev) {
    ev.preventDefault()
    setContextMenu({ show: true, x: ev.pageX, y: ev.pageY, itemId: _id })
  }

  function onDelete(ev) {
    ev.stopPropagation()
    onDeleteStation(_id)
    setContextMenu(initialContextMenu)
  }

  return (
    <section>
      {contextMenu.show && contextMenu.itemId === _id && (
        <ul
          className="station-context-menu"
          ref={menuRef}
          style={{ top: contextMenu.y, left: contextMenu.x, position: 'absolute', zIndex: 20 }}
          onClick={() => setContextMenu(initialContextMenu)}
        >
          <li onClick={onDelete}>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2" />
              </svg>
            </span>
            Delete
          </li>
        </ul>
      )}
      <li
        ref={setDragRef}
        className={`${getClassName()}${isOver ? ' drag-over' : ''}`}
        onClick={() => onClickSonglist(_id)}
        onContextMenu={handleStationMenu}
      >
        <div className="img-wrapper">
          <div className="img-bg" />
          {getImgContent()}
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
  )
}

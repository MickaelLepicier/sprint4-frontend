import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useEffect, useRef, useState } from 'react'
import { SongPreview } from './SongPreview.jsx'
import { ClockIcon } from './svg/ClockIcon.jsx'

export function SongList({ songs, station, onTogglePlay, handleDragEnd, isLikedSongs }) {
  const [isSticky, setIsSticky] = useState(false)
  const [selectedSongId, setSelectedSongId] = useState(null)
  const [justLikedSongId, setJustLikedSongId] = useState(null)
  
  const sentinelRef = useRef(null)
  const listRef = useRef()
  
  const isStickyCN = isSticky ? 'is-sticky' : ''
  const showAlbum = !!station?.songs?.some(song => song.album)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 1 }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setSelectedSongId(null)
        setJustLikedSongId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /*
    TODO:
    maybe put here SongList comp and make this comp PlayListDetails
    use the function to make ...
  */

  return (
    <div className="song-list-container" ref={listRef}>
      <div ref={sentinelRef} style={{ height: '1px' }}></div>
      {/* <div ref={sentinelRef} style={{ height: '1px' }}></div> for sticky effect */}
      
      <div className={`song-list-header-container ${isStickyCN}`}>
        <div className={`song-list-header${showAlbum ? '' : ' no-album'}`}>
          <div className="col col-idx">#</div>
          <div className="col col-title">Title</div>
          {/* <div className="col col-artist">Artist</div> */}
          {showAlbum && <div className="col col-album">Album</div>}
          <div className="col col-date">Date Added</div>
          {/* {isLikedSongs && <div className="col col-date">Date Added</div>} */}

          <div className="col col-actions">
            <ClockIcon />
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="songs-droppable" direction="vertical">
          {(provided) => (
            <div className="song-list-body" ref={provided.innerRef} {...provided.droppableProps}>
              {songs.map((song, idx) => (
                <Draggable key={song.id + idx} draggableId={song.id} index={idx}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <SongPreview
                        song={song}
                        idx={idx}
                        station={station}
                        togglePlay={() => onTogglePlay(song)}
                        isLikedSongs={isLikedSongs}
                        selectedSongId={selectedSongId}
                        setSelectedSongId={setSelectedSongId}
                        justLikedSongId={justLikedSongId}
                        setJustLikedSongId={setJustLikedSongId}
                        showAlbum={showAlbum}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

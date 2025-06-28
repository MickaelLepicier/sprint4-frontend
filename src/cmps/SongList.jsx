import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useEffect, useRef, useState } from 'react'
import { SongPreview } from './SongPreview.jsx'

export function SongList({ songs, station, onTogglePlay, handleDragEnd, isLikedSongs }) {
  const sentinelRef = useRef(null)
  const [isSticky, setIsSticky] = useState(false)
  const isStickyCN = isSticky ? 'is-sticky' : ''
  // CN = ClassName

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

  /*

      TODO:
      maybe put here SongList comp and make this comp PlayListDetails
      use the function to make ...

    */

  return (
    <div className="song-list-container">
      <div ref={sentinelRef} style={{ height: '1px' }}></div> {/* for sticky effect */}
      <div className={`song-list-header ${isStickyCN}`}>
        <div className="col col-idx">#</div>
        <div className="col col-title">Title</div>
        <div className="col col-album">Album</div>
        {isLikedSongs && <div className="col col-date">Date Added</div>}

        <div className="col col-actions">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="8.5" stroke="#b3b3b3" strokeWidth="1.5" />
            <line x1="11" y1="7" x2="11" y2="11" stroke="#b3b3b3" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="11" y1="11" x2="14" y2="11" stroke="#b3b3b3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
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

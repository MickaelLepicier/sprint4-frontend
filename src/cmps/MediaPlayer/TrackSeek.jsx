import { useEffect, useRef, useState } from 'react'

export function TrackSeek({ progress, duration, handleClickSeek, isNotAllowed, onSeek }) {
  const containerRef = useRef(null)
  const [previewProgress, setPreviewProgress] = useState(null)
  const isDragging = previewProgress !== null

  const barPercent = getBarPercent()
  const barStyle = { width: `${barPercent}%` }
  const thumbStyle = { left: `calc(${barPercent}% - 6px)` }

  function getBarPercent() {
    const currentProgress = isDragging ? previewProgress : progress
    return currentProgress && duration ? (currentProgress / duration) * 100 : 0
  }

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  function handleMouseDown(ev) {
    if (isNotAllowed) return
    ev.preventDefault()

    const updateSeek = (e) => {
      if (!containerRef.current || !duration) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const ratio = Math.max(0, Math.min(1, x / rect.width))
      const newTime = ratio * duration
      setPreviewProgress(newTime) 
    }

    const finishSeek = () => {
      if (previewProgress !== null && onSeek) {
        onSeek(previewProgress)
      }
      setPreviewProgress(null)
      window.removeEventListener('mousemove', updateSeek)
      window.removeEventListener('mouseup', finishSeek)
    }

    window.addEventListener('mousemove', updateSeek)
    window.addEventListener('mouseup', finishSeek)
  }

  return (
    <div className="track-seek flex">
      <div className="track-time">{formatTime(isDragging ? previewProgress : progress)}</div>

      <div
        ref={containerRef}
        className={`track-bar-container ${isNotAllowed}`}
        onClick={handleClickSeek}
      >
        <div className="track-bar-bg">
          <div className="track-bar-fill" style={barStyle}></div>
        </div>
        <div
          className="track-thumb"
          style={thumbStyle}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className="track-time">{formatTime(duration)}</div>
    </div>
  )
}

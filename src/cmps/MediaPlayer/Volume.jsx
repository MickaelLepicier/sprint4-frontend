import { useRef, useState } from 'react'
import { SetTrackBtn } from '../SetTrackBtn'

export function Volume({ volume, toggleMute, handleVolumeChange }) {
  const containerRef = useRef(null)
  const [previewVol, setPreviewVol] = useState(null)
  const isDragging = previewVol !== null

  const currentVolume = isDragging ? previewVol : volume
  const barStyle = { width: `${currentVolume}%` }
  const thumbStyle = { left: `calc(${currentVolume}% - 6px)` }

  function getVolumeClassName() {
    if (currentVolume === 0) return 'volume-mute'
    if (currentVolume <= 40) return 'volume-low'
    if (currentVolume <= 80) return 'volume-meduim'
    return 'volume-high'
  }

  function handleMouseDown(ev) {
    ev.preventDefault()

    const updateVolume = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const ratio = Math.max(0, Math.min(1, x / rect.width))
      const newVol = Math.round(ratio * 100)
      setPreviewVol(newVol)
    }

    const finishSeek = () => {
      if (previewVol !== null) {
        handleVolumeChange({ target: { value: previewVol } })
      }
      setPreviewVol(null)
      window.removeEventListener('mousemove', updateVolume)
      window.removeEventListener('mouseup', finishSeek)
    }

    window.addEventListener('mousemove', updateVolume)
    window.addEventListener('mouseup', finishSeek)
  }

  function handleClickVolume(ev) {
    const rect = containerRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    const newVol = Math.round(ratio * 100)
    handleVolumeChange({ target: { value: newVol } })
  }

  return (
    <section className="track-options flex-center">
      <SetTrackBtn className={getVolumeClassName()} onClick={toggleMute} />

      <div
        className="track-bar-container"
        ref={containerRef}
        onClick={handleClickVolume}
      >
        <div className="track-bar-bg">
          <div className="track-bar-fill" style={barStyle}></div>
        </div>
        <div className="track-thumb" style={thumbStyle} onMouseDown={handleMouseDown} />
      </div>

    </section>
  )
}

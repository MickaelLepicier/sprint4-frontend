import { useSliderDrag } from '../../hooks/useSliderDrag'

export function TrackSeek({ progress, duration, isNotAllowed, onSeek }) {
  const { containerRef, currentValue, handleMouseDown, handleClick } = useSliderDrag({
    max: duration,
    onChange: onSeek
  })

  const percent = duration ? (currentValue(progress) / duration) * 100 : 0

  return (
    <div className="track-seek flex">
      <div className="track-time">{formatTime(currentValue(progress))}</div>

      <div ref={containerRef} className={`track-bar-container ${isNotAllowed}`} onClick={handleClick}>
        <div className="track-bar-bg">
          <div className="track-bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="track-thumb" style={{ left: `calc(${percent}% - 6px)` }} onMouseDown={handleMouseDown} />
      </div>

      <div className="track-time">{formatTime(duration)}</div>
    </div>
  )

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }
}

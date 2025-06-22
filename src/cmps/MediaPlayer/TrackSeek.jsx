export function TrackSeek({ progress, duration, handleClickSeek, isNotAllowed }) {
  const barStyle = { width: `${trackBarStyle()}%` }
  const thumbStyle = { left: `calc(${trackBarStyle()}% - 6px)` }

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  function trackBarStyle() {
    let res = (progress / duration) * 100
    if (!progress || !duration) res = 0
    return res
  }

  return (
    <div className="track-seek flex">
      <div className="track-time">{formatTime(progress)}</div>

      <div className={`track-bar-container ${isNotAllowed}`} onClick={handleClickSeek}>
        <div className="track-bar-bg">
          <div className="track-bar-fill" style={barStyle}></div>
        </div>
        <div className="track-thumb" style={thumbStyle} />
      </div>

      <div className="track-time">{formatTime(duration)}</div>
    </div>
  )
}

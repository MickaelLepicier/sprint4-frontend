import { useSliderDrag } from '../../hooks/useSliderDrag'
import { SetTrackBtn } from '../SetTrackBtn'

export function Volume({ volume, toggleMute, handleVolumeChange, isDisabled }) {
  const { containerRef, currentValue, handleMouseDown, handleClick } = useSliderDrag({
    max: 100,
    onChange: (val) => handleVolumeChange({ target: { value: Math.round(val) } })
  })
  const vol = currentValue(volume)
  const barStyle = { width: `${vol}%` }
  const thumbStyle = { left: `calc(${vol}% - 6px)` }
  const title = vol === 0 ? 'Unmute' : 'Mute'

  
  function getVolumeClassName() {
    if (vol === 0) return 'volume-mute'
    if (vol <= 40) return 'volume-low'
    if (vol <= 80) return 'volume-medium'
    return 'volume-high'
  }

  return (
    <section className="track-options flex-center" style={isDisabled}>
      <SetTrackBtn className={getVolumeClassName()} onClick={toggleMute} title={title} />

      <div className="track-bar-container" ref={containerRef} onClick={handleClick}>
        <div className="track-bar-bg">
          <div className="track-bar-fill" style={barStyle} />
        </div>
        <div className="track-thumb" style={thumbStyle} onMouseDown={handleMouseDown} />
      </div>
    </section>
  )
}

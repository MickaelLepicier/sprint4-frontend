// *** ICONS ***
import prev from '../../assets/icons/media-player/prev_song.svg'
import next from '../../assets/icons/media-player/next_song.svg'

import shuffle from '../../assets/icons/media-player/shuffle.svg'
import repeat from '../../assets/icons/media-player/repeat.svg'

import { ReactYouTube } from '../ReactYouTube.jsx'
import {
  nextSong,
  prevSong,
  setIsPlaying
} from '../../store/station/station.actions.js'
import { PlayButton } from '../PlayButton.jsx'
import { SetActionBtn } from '../util/SetActionBtn.jsx'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

export function TrackControl({ currSong, volume }) {
  // TODO - fix bugs - when click on playBtn play a song or return if there is no song

  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  )

  // track time
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const playerRef = useRef(null)
  window.playerRef = playerRef

  const isTrackAllowed = !playerRef.current || !currSong
  const isNotAllowed = isTrackAllowed ? 'not-allowed' : ''

  const repeatActive = isRepeat ? 'active' : ''
  const song = { ...currSong }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current || !isPlaying) return

      const currentTime = playerRef.current.getCurrentTime?.()
      const totalTime = playerRef.current.getDuration?.()
    //   console.log('totalTime: ',totalTime)
      if (typeof currentTime === 'number' && typeof totalTime === 'number') {
        setProgress(currentTime)
        setDuration(totalTime)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [song, isPlaying, volume])

  useEffect(() => {
    // if (currSong && isPlaying) {
    //   audioRef.current.src = currSong.url
    //   audioRef.current.play()
    // }
  }, [currSong])

  function onTogglePlay() {
    // console.log('ONTOGGLE - TrackControl ')
    // console.log('currSong: ', currSong)
    if (isTrackAllowed) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    } else {
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  function onEnd() {
    if (isRepeat && playerRef.current) {
      playerRef.current.seekTo(0)
      playerRef.current.playVideo()
    } else {
      nextSong()
    }
  }
  function onNextSong() {
    if (isTrackAllowed) return
    nextSong()
  }

  function onPrevSong() {
    if (isTrackAllowed) return
    prevSong()
  }

  function onRepeat() {
    if (isTrackAllowed) return
    setIsRepeat(!isRepeat)
  }

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  function handleSeekChange(ev) {
    const newTime = +ev.target.value
    playerRef.current.seekTo(newTime, true)
    setProgress(newTime)
  }

  return (
    <section className="track-controls-container">
      <div className="track-actions">
        <SetActionBtn imgSrc={shuffle} str={`shuffle ${isNotAllowed}`} />
        <SetActionBtn
          imgSrc={prev}
          str={`prev ${isNotAllowed}`}
          onClick={onPrevSong}
          dis={!song}
        />

        <PlayButton
          isPlaying={isPlaying}
          onToggle={onTogglePlay}
          addClassName={isNotAllowed}
        />

        <SetActionBtn
          imgSrc={next}
          str={`next ${isNotAllowed}`}
          onClick={onNextSong}
          dis={!song}
        />
        <SetActionBtn
          imgSrc={repeat}
          str={`repeat ${repeatActive} ${isNotAllowed}`}
          onClick={onRepeat}
        />
      </div>

      <div className="track-seek flex">
        <div className="track-time">{formatTime(progress)}</div>
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          step="0.1"
          onChange={handleSeekChange}
          className={`track-bar ${isNotAllowed}`}
          style={{
            '--bar-fill': duration ? `${(progress / duration) * 100}%` : '0%'
          }}
        />
        <div className="track-time">{formatTime(duration)}</div>
      </div>

      <span className="react-youtube">
        <ReactYouTube
          key={song._id}
          videoId={song._id}
          isPlaying={isPlaying}
          volume={volume}
          playerRef={playerRef}
          onEnd={onEnd}
        />
      </span>
    </section>
  )
}

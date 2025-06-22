import { ReactYouTube } from '../ReactYouTube.jsx'
import { nextSong, prevSong, setIsPlaying } from '../../store/station/station.actions.js'
import { PlayBtn } from '../PlayBtn.jsx'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { SetTrackBtn } from '../SetTrackBtn.jsx'
import { TrackSeek } from './TrackSeek.jsx'

// TODOs:
// [v] fix bugs about PlayBtn
// [] add shuffle functionality
// [v] add next song after song finish
// [v] add border-radius: 2px to the line

// [v] add prev song first click to take the track to the start
// (if the song is up to 2 sec so the song go back 1 track)

export function TrackControl({ currSong, volume }) {
  const isPlaying = useSelector((storeState) => storeState.stationModule.isPlaying)
  // const station = useSelector((storeState) => storeState.stationModule.station)

  // track time
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const playerRef = useRef(null)
  window.playerRef = playerRef

  const isTrackAllowed = !playerRef.current || !currSong
  const isNotAllowed = isTrackAllowed ? 'not-allowed' : ''
  const isPlay = isPlaying ? 'track-control-pause-icon' : 'track-control-play-icon'

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

    const currentTime = playerRef.current?.getCurrentTime?.()

    if (typeof currentTime === 'number') {
      if (currentTime > 2) {
        playerRef.current.seekTo(0)
      } else {
        prevSong()
      }
    }
  }

  function onRepeat() {
    if (isTrackAllowed) return
    setIsRepeat(!isRepeat)
  }

  // function formatTime(sec) {
  //   const minutes = Math.floor(sec / 60)
  //   const seconds = Math.floor(sec % 60)
  //     .toString()
  //     .padStart(2, '0')
  //   return `${minutes}:${seconds}`
  // }

  function handleClickSeek(ev) {
    const rect = ev.currentTarget.getBoundingClientRect()
    const clickX = ev.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration

    playerRef.current?.seekTo(newTime, true)
    setProgress(newTime)
  }

  // function trackBarStyle(){
  // let res = (progress / duration) * 100
  // if(!progress || !duration) res = 0
  // return res
  // }

  return (
    <section className="track-controls-container">
      <div className="track-actions">
        <SetTrackBtn className={`shuffle ${isNotAllowed}`} />

        <SetTrackBtn className={`prev-song ${isNotAllowed}`} onClick={onPrevSong} dis={!song} />

        <PlayBtn onToggle={onTogglePlay} isPlaying={isPlaying} className={`${isPlay} ${isNotAllowed}`} />

        <SetTrackBtn className={`next-song ${isNotAllowed}`} onClick={onNextSong} dis={!song} />
        <SetTrackBtn className={`repeat ${isNotAllowed} ${repeatActive}`} onClick={onRepeat} dis={!song} />
      </div>

      {/* TrackSeek comp */}

      <TrackSeek
        progress={progress}
        duration={duration}
        handleClickSeek={handleClickSeek}
        isNotAllowed={isNotAllowed}
      />

    

      {/* <div className="track-seek flex">
        <div className="track-time">{formatTime(progress)}</div>

        <div className={`track-bar-container ${isNotAllowed}`} onClick={handleClickSeek}>
          <div className="track-bar-bg">
            <div className="track-bar-fill" style={{ width: `${trackBarStyle()}%` }}></div>
          </div>
          <div className="track-thumb" style={{ left: `calc(${trackBarStyle()}% - 6px)` }} />
        </div>

        <div className="track-time">{formatTime(duration)}</div>
      </div> */}

      <span className="react-youtube">
        <ReactYouTube
          key={song.id}
          videoId={song.id}
          // isPlaying={isPlaying}
          volume={volume}
          playerRef={playerRef}
          onEnd={onEnd}
        />
      </span>
    </section>
  )
}

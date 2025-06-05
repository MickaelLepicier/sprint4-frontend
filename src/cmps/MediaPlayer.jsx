// *** ICONS ***
import play from '../assets/icons/media-player/play_small.svg'
import pause from '../assets/icons/media-player/pause_small.svg'
import prev from '../assets/icons/media-player/prev_song.svg'
import next from '../assets/icons/media-player/next_song.svg'

import volumeLow from '../assets/icons/media-player/volume_low.svg'
import volumeMedium from '../assets/icons/media-player/volume_medium.svg'
import volumeHigh from '../assets/icons/media-player/volume_high.svg'
import volumeMute from '../assets/icons/media-player/volume_mute.svg'

import shuffle from '../assets/icons/media-player/shuffle.svg'
import repeat from '../assets/icons/media-player/repeat.svg'

import { ReactYouTube } from './ReactYoutube.jsx'

import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import {
  nextSong,
  prevSong,
  setIsPlaying,
  togglePlay
} from '../store/station/station.actions.js'
import { PlayButton } from './PlayButton.jsx'
import { SetActionBtn } from './util/SetActionBtn.jsx'

export function MediaPlayer() {
  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  )
  const currSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  )
  const station = useSelector((storeState) => storeState.stationModule.station)

  // console.log('XXXXXXX isPlaying: ',isPlaying)
  // console.log('YYYYYYYY currSong: ',currSong)

  //   const videoId = 'SRXH9AbT280' // Extract from YouTube URL

  // track time
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  // volume
  const [volume, setVolume] = useState(50)
  const [prevVolume, setPrevVolume] = useState(50)

  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const playerRef = useRef(null)
  window.playerRef = playerRef

  const song = { ...currSong }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current || !isPlaying) return

      const currentTime = playerRef.current.getCurrentTime?.()
      const totalTime = playerRef.current.getDuration?.()
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
    if (!playerRef.current) return

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
    nextSong()
  }

  function onPrevSong() {
    prevSong()
  }

  function onRepeat(){
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

  // *** VOLUME ***

  function handleVolumeChange(ev) {
    const newVolume = +ev.target.value
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }

  function toggleMute() {
    if (volume === 0) {
      setVolume(prevVolume)
      if (playerRef.current) playerRef.current.setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      if (playerRef.current) playerRef.current.setVolume(0)
    }
  }

  function getVolumeIcon() {
    let imgSrc = volumeHigh

    if (volume === 0) imgSrc = volumeMute
    else if (volume <= 40) imgSrc = volumeLow
    else if (volume <= 80) imgSrc = volumeMedium

    return <img src={imgSrc} alt="volume icon" />
  }

  return (
    <footer className="media-player-container flex align-center">
      <section> song data</section>

      <section className="track-controls-container">
        <div className="track-actions">
          <SetActionBtn imgSrc={shuffle} str="shuffle" />
          <SetActionBtn
            imgSrc={prev}
            str="prev"
            onClick={onPrevSong}
            dis={!song}
          />

          <PlayButton isPlaying={isPlaying} onToggle={onTogglePlay} />

          <SetActionBtn
            imgSrc={next}
            str="next"
            onClick={onNextSong}
            dis={!song}
          />
          <SetActionBtn imgSrc={repeat} str="repeat" onClick={onRepeat} />

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
            className="track-bar"
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
            // volume={50}
            playerRef={playerRef}
            onEnd={onEnd}
          />
        </span>
      </section>

      {/* *** VOLUME *** */}

      <section className="track-options flex">
        <button className="track-action" onClick={toggleMute}>
          <span>{getVolumeIcon()}</span>
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="track-bar"
          style={{ '--bar-fill': `${volume}%` }}
        />
      </section>
    </footer>
  )
}

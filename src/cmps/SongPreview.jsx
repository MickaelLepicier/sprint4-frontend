import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { PlayBtn } from './PlayBtn'
import { LikeIcon } from './svg/LikeIcon'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadStation, updateStation } from '../store/station/station.actions'
import { stationService } from '../services/station'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { cleanTitle } from '../services/util.service'
import { LikeToggleBtn } from './LikeToggleBtn'
import { SidebarPlayBtn } from './Sidebar/SidebarPlayBtn'
import equalizerGif from '/src/assets/img/equalizer.gif'

// Added DND props to the signature
export function SongPreview({
  song,
  idx,
  station,
  draggableProps,
  dragHandleProps,
  innerRef,
  isLikedSongs,
  selectedSongId,
  setSelectedSongId,
  justLikedSongId,
  setJustLikedSongId,
  showAlbum,
}) {
  const isPlaying = useSelector(storeState => storeState.stationModule.isPlaying)
  const currSong = useSelector(storeState => storeState.stationModule.currentSong)
  const user = useSelector(storeState => storeState.userModule.user)
  const dispatch = useDispatch()

  const isActiveCN = currSong?.id === song?.id ? 'active' : ''
  const isCurrSong = song?.id === currSong?.id
  const isPlay = isPlaying && isCurrSong ? 'song-preview-pause-icon' : 'song-preview-play-icon'

  // const duration = window.playerRef?.current?.getDuration?.() ?? null

  function formatDuration(dur) {
    // if (!dur) return '00:00'
    if (!dur) return ''

    const duration = +dur
    const mins = Math.floor(duration / 60)
    const secs = duration % 60
    const formatDuration = secs < 10 ? '0' + secs : secs

    return `${mins}:${formatDuration}`
  }

  function setAddedDate() {
    const date = new Date(song.addedAt).toLocaleDateString()
    return date || getRandomFormattedDate()
  }

  function onSetSong(song, forceSeek = false) {
    dispatch({ type: SET_SONG, song })
    dispatch({ type: SET_IS_PLAYING, isPlaying: true })

    if (forceSeek && window.playerRef?.current) {
      window.playerRef.current.seekTo(0)
    }
  }

  function formatDate(date) {
    if (!date) return ''
    let ts = typeof date === 'object' ? date.$numberLong : date
    if (!ts) return ''
    return new Date(Number(ts)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div
      className={`song-row
        ${selectedSongId === song.id ? 'active' : ''}
        ${justLikedSongId === song.id ? 'just-liked' : ''}
        ${currSong?.id === song.id && isPlaying ? 'playing' : ''}
        ${showAlbum ? '' : ' no-album'}
      `}
      onClick={() => setSelectedSongId(song?.id)}
      onDoubleClick={() => onSetSong(song, true)}
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <div className="col col-idx">
        <div className="idx-and-play-container">
          <span className="song-idx" id="song-idx">
            {idx + 1}
          </span>
          <SidebarPlayBtn station={station} song={song} isLargePlayIcon={true} />
          <img className="equalizer-gif" src={equalizerGif} />
        </div>
      </div>

      <div className="col col-details flex align-center">
        <img src={song.imgUrl} />
        <div className="song-info">
          <div className="col col-title">
            <span>{cleanTitle(song.title, 100)}</span>
          </div>
          <div className="col col-artist">
            <span>{cleanTitle(song.artist, 100)}</span>
          </div>
        </div>
      </div>

      {/* <div className="col col-title">
        <span>{cleanTitle(song.title, 100)}</span>
      </div>
      
      <div className="col col-artist">
        <span>{cleanTitle(song.artist, 100)}</span>
      </div> */}

      {showAlbum && (
        <div className="col col-album">
          <span>{cleanTitle(station.name, 100)}</span>
        </div>
      )}

      <div className="col col-date">
        <span>{formatDate(song.addedAt)}</span>
      </div>

      <div className="col col-actions">
        {user && (
          <LikeToggleBtn
            song={song}
            onLike={() => {
              setJustLikedSongId(song.id)
              setSelectedSongId(null)
            }}
            onUnlike={() => {
              setSelectedSongId(song.id)
              setJustLikedSongId(null)
            }}
          />
        )}
        <div className="song-duration-wrapper">
          <span className="song-duration">{formatDuration(song.duration)}</span>
        </div>
        <div className="menu-placeholder" style={{ width: '16px' }}></div>
      </div>

      {/* {isLikedSongs && <div className="col col-date">{setAddedDate()}</div>} */}
    </div>
  )
}

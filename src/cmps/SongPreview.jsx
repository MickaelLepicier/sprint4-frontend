import { useSelector } from 'react-redux'
import { PlayBtn } from './PlayBtn'
import { LikeIcon } from './svg/LikeIcon'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadStation, updateStation } from '../store/station/station.actions'
import { stationService } from '../services/station'
import { cleanTitle } from '../services/util.service'
import { LikeToggleBtn } from './LikeToggleBtn'

// Added DND props to the signature
export function SongPreview({
  song,
  idx,
  station,
  togglePlay,
  draggableProps,
  dragHandleProps,
  innerRef,
  isLikedSongs
}) {
  const isPlaying = useSelector((storeState) => storeState.stationModule.isPlaying)
  const currSong = useSelector((storeState) => storeState.stationModule.currentSong)

  const user = useSelector((storeState) => storeState.userModule.user)
  const likedStationId = user?.likedSongsStationId || ''

  const isActiveCN = currSong?.id === song?.id ? 'active' : ''
  // CN = className
  
  const isCurrSong = song?.id === currSong?.id
  const isPlay = isPlaying && isCurrSong ? 'song-preview-pause-icon' : 'song-preview-play-icon'


  // const likedStation = useSelector((storeState) =>
  //   storeState.stationModule.stations.find((station) => station._id === likedStationId)
  // )
  // const isLiked = likedStation?.songs?.some((s) => s.id === song.id)

  // TODOs:
  // [] add AddLiked btn

  // [] add Album of the track:
  //  put in song data album and put the data at the Album section (song.album)

  // [] If there is no room for the txt inside the td put ... instead

  // const duration = window.playerRef?.current?.getDuration?.() ?? null



  function formatDuration(dur) {
    if (!dur) return '00:00'

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

  return (
    <div
      className={`song-row ${isActiveCN}`}
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onDoubleClick={togglePlay}
    >
      <div className="col col-idx">
        <span className="song-idx">{idx + 1}</span>
        <PlayBtn onToggle={togglePlay} className={isPlay} />
      </div>

      <div className="col col-title">
        <div className="song-img-title">
          <img src={song.imgUrl} alt="img" />
          <p>{cleanTitle(song.title)}</p>
        </div>
      </div>

      <div className="col col-album">{cleanTitle(station.name)}</div>

      {isLikedSongs && <div className="col col-date">{setAddedDate()}</div>}

      <div className="col col-actions">
        <LikeToggleBtn song={song} />
        <span className="song-duration">{formatDuration(song.duration)}</span>
      </div>
    </div>
  )
}


/*

 <tr
      className={`song-row ${isActiveCN}`}
      // onDoubleClick={() => togglePlay(song)}
      onDoubleClick={togglePlay}
      ref={innerRef} // DND: attach ref
      {...draggableProps} // DND: attach drag props
      {...dragHandleProps} // DND: attach drag handle props
    >
      <td className="song-play-idx">
        <span className="song-idx">{idx + 1}</span>
        <PlayBtn onToggle={togglePlay} className={isPlay} />
      </td>
      <td>
        <div className="song-img-title">
          <img src={song.imgUrl} alt="img" style={{ width: 40 + 'px', height: 40 + 'px' }} />
          <p>{cleanTitle(song.title)}</p>
        </div>
      </td>
      <td>{cleanTitle(station.name)}</td>
     

      {isLikedSongs && <td>{setAddedDate()}</td>}

      <td>

        <LikeToggleBtn song={song}/>

        <span className="song-duration">{formatDuration(song.duration)} </span>
      </td>
    </tr>

*/
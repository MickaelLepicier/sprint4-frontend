import { useSelector } from 'react-redux'
import { PlayButton } from './PlayButton'
import { AddIcon } from './svg/AddIcon'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadStation, updateStation } from '../store/station/station.actions'
import { stationService } from '../services/station'
import { cleanTitle } from '../services/util.service'

// Added DND props to the signature
export function SongPreview({ song, idx, station, togglePlay, draggableProps, dragHandleProps, innerRef }) {
  const isPlaying = useSelector(storeState => storeState.stationModule.isPlaying)

  const currSong = useSelector(storeState => storeState.stationModule.currentSong)
  const user = useSelector(storeState => storeState.userModule.user)
  const likedStationId = user?.likedSongsStationId || ''

  const addClassName = currSong?.id === song?.id ? 'active' : ''

  const likedStation = useSelector(storeState =>
    storeState.stationModule.stations.find(station => station._id === likedStationId)
  )
  const isLiked = likedStation?.songs?.some(s => s.id === song.id)

  // TODOs:
  // [] add Album of the track
  // [] add Date added of the track
  // [] add Duration of the track
  // [] add Duration watch icon in the SongList
  // [] add AddLiked of the track

  const duration = window.playerRef?.current?.getDuration?.() ?? null
  // console.log('DDDD duration: ',duration)

  async function onAddSongToLiked(song) {
    try {
      if (!user || !likedStationId) {
        showErrorMsg('You must be logged in to like songs.')
        return
      }

      const stationToUpdate = await stationService.getById(likedStationId)

      let updatedSongs
      if (isLiked) {
        updatedSongs = stationToUpdate.songs.filter(s => s.id !== song.id)
        showSuccessMsg('Song Removed')
      } else {
        updatedSongs = [song, ...stationToUpdate.songs]
        showSuccessMsg('Song Added')
      }

      const updatedStation = { ...stationToUpdate, songs: updatedSongs }
      console.log('updatedStation:', updatedStation)

      await updateStation(updatedStation)
    } catch (error) {
      console.log('error:', error)
      showErrorMsg(`Couldn't add Song`)
    }
  }

  function formatDuration(dur) {
    const duration = +dur
    const mins = Math.floor(duration / 60)
    const secs = duration % 60
    const formatDuration = secs < 10 ? '0' + secs : secs

    return `${mins}:${formatDuration}`
  }

  return (
    <tr
      className={`song-row ${addClassName}`}
      // onDoubleClick={() => togglePlay(song)}
      onDoubleClick={togglePlay}
      ref={innerRef} // DND: attach ref
      {...draggableProps} // DND: attach drag props
      {...dragHandleProps} // DND: attach drag handle props
    >
      <td className="song-play-idx">
        <span className="song-idx">{idx + 1}</span>
        <PlayButton
          isPlaying={isPlaying && addClassName}
          // onToggle={() => togglePlay(song)}
          onToggle={togglePlay}
          addClassName="song-preview-play-btn"
        />
      </td>
      <td>
        <div className="song-img-title">
          <img src={song.imgUrl} alt="img" style={{ width: 40 + 'px', height: 40 + 'px' }} />
          <p>{cleanTitle(song.title)}</p>
        </div>
      </td>
      <td>{cleanTitle(station.name)}</td>
      <td>{new Date(song.addedAt).toLocaleDateString()}</td>

      <td>
        <button
          className={`add-to-liked ${isLiked ? 'liked' : ''}`}
          title="Add to Liked Songs"
          onClick={() => {
            onAddSongToLiked(song)
          }}
        >
          <AddIcon />
        </button>
        {/* <span className="song-duration">⏱️ </span> */}
        <span className="song-duration">{formatDuration(song.duration)} </span>
        {/* <button className="more-options">...</button> */}
      </td>
    </tr>
  )
}

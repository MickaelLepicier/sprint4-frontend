import { useSelector } from 'react-redux'
import { PlayButton } from './PlayButton'

// Added DND props to the signature
export function SongPreview({
  song,
  idx,
  station,
  togglePlay,
  draggableProps,
  dragHandleProps,
  innerRef
}) {
  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  )

  const currSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  )

  const addClassName = currSong?._id === song?._id ? 'active' : ''


  // TODOs:
  // [] add Album of the track
  // [] add Date added of the track
  // [] add Duration of the track
  // [] add Duration watch icon in the SongList
  // [] add AddLiked of the track


    const duration = window.playerRef?.current?.getDuration?.() ?? null
  // console.log('DDDD duration: ',duration)

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
          <img
            src={song.imgUrl}
            alt="img"
            style={{ width: 40 + 'px', height: 40 + 'px' }}
          />
          <p>{song.title}</p>
        </div>
      </td>
      <td>{station.name}</td>
      <td>{new Date(song.addedAt).toLocaleDateString()}</td>

      <td>
        {/* <button className="add-to-liked">+</button> */}
        {/* <span className="song-duration">⏱️ </span> */}
        <span className="song-duration">4:30 </span>
        {/* <button className="more-options">...</button> */}
      </td>
    </tr>
  )
}

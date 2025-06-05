import { useSelector } from 'react-redux'
import { PlayButton } from './PlayButton'

export function SongPreview({ song, idx, station, togglePlay }) {
  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  )

  const currSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  )

  const addClassName = currSong?._id === song?._id ? 'active' : ''
  console.log('addClassName: ', addClassName)

  return (
    <tr
      key={song._id}
      className={`song-row ${addClassName}`}
      onDoubleClick={() => togglePlay(song)}
    >
      <td className="song-play-idx">
        <span className="song-idx">{idx + 1}</span>
        <PlayButton
          isPlaying={isPlaying}
          onToggle={() => togglePlay(song)}
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
        <button className="add-to-liked">+</button>
        <span className="song-duration">⏱️ </span>
        <button className="more-options">...</button>
      </td>
    </tr>
  )
}

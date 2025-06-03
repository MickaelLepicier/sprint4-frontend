import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { debounce } from '../services/util.service'
import { showErrorMsg } from '../services/event-bus.service'
import { updateStation } from '../store/station/station.actions'

export function SongSearchResult() {
  const songs = useSelector(storeState => storeState.searchModule.searchResults)
  const currStation = useSelector(storeState => storeState.stationModule.station)
  const stationSongs = useSelector(storeState => storeState.stationModule.station.songs)

  async function onAddSong(song) {
    try {
      const normalizedSong = {
        _id: song.id,
        url: `https://www.youtube.com/watch?v=${song.id}`,
        title: song.title,
        imgUrl: song.imgUrl.replace('default.jpg', 'mqdefault.jpg'),
        addedAt: Date.now(),
        addedBy: 'u999',
        likedBy: [],
      }

      const stationToSave = {
        ...currStation,
        songs: [...currStation.songs, normalizedSong],
      }
      await updateStation(stationToSave)
      showSuccessMsg('Song added to playlist!')
    } catch (error) {
      showErrorMsg('Error adding song')
    }
  }

  if (!songs?.length) return null
  return (
    <section>
      <ul>
        {songs.map(song =>
          song?.imgUrl ? (
            <li key={song.id}>
              <img src={song.imgUrl} alt={song.title || ''} />
              <div>
                <h4>{song.title || ''}</h4>
                <p>{song.artist || ''}</p>
              </div>
              <button onClick={() => onAddSong(song)}>Add</button>
            </li>
          ) : null
        )}
      </ul>
    </section>
  )
}

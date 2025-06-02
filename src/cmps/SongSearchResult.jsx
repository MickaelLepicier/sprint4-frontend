import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { SET_IS_PLAYING, SET_SONG, SET_STATION } from '../store/station/station.reducer'
import { debounce } from '../services/util.service'

export function SongSearchResult() {
  const songs = useSelector(storeState => storeState.searchModule.searchResults)
  console.log('songs:', songs)
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
            </li>
          ) : null
        )}
      </ul>
    </section>
  )
}

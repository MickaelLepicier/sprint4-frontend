import { useNavigate } from 'react-router'
import { GenrePreview } from './GenrePreview'
import { loadSearchResults } from '../store/search/search.actions'
import { useDispatch } from 'react-redux'
import { LOADING_DONE, LOADING_START } from '../store/system/system.reducer'

export function GenreList({ genres }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  async function onClickGenre(genre) {
    try {
      dispatch({ type: LOADING_START })
      loadSearchResults(genre.name, 'genre')
      navigate(`/genre/${genre.name}`, {
        state: { color: genre.color },
      })
    } catch (error) {
      showErrorMsg('Search failed')
    } finally {
      dispatch({ type: LOADING_DONE })
    }
  }

  return (
    <section className="genre-list" role="list">
      {genres.map(genre => (
        <GenrePreview
          key={genre.name}
          genreName={genre.name}
          color={genre.color}
          imgUrl={genre.imgUrl}
          onClickGenre={() => onClickGenre(genre)}
        />
      ))}
    </section>
  )
}

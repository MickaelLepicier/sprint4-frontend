import { useNavigate } from 'react-router'
import { GenrePreview } from './GenrePreview'
import { loadSearchResults } from '../store/search/search.actions'

export function GenreList({ genres }) {
  const navigate = useNavigate()

  function onClickGenre(genre) {
    loadSearchResults(genre.name, 'genre')
    navigate(`/genre/${genre.name}`, {
        state: { color: genre.color }
    })
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

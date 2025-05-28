import { GenrePreview } from './GenrePreview'

export function GenreList({ genres }) {
    return (
        <section className="genre-list" role="list">
            {genres.map(genre => (
                <GenrePreview
                    key={genre.name}
                    genreName={genre.name}
                    color={genre.color}
                    imgUrl={genre.imgUrl}
                />
            ))}
        </section>
    )
}

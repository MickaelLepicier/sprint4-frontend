import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { ArtistSearchResult } from '../cmps/ArtistSearchResult'
import { GenreSearchResult } from '../cmps/GenreSearchResult'
import { SongSearchResult } from '../cmps/SongSearchResult'

export function SearchStations() {
  const type = useSelector(storeState => storeState.searchModule.searchType)

  return (
    <>
      {type === 'stations' && <ArtistSearchResult />}
      {/* {type === 'songs' && <SongSearchResult />} */}
      {type === 'genre' && <GenreSearchResult />}
    </>
  )
}

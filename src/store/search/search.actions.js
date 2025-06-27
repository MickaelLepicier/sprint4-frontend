import { stationService } from '../../services/station/station.service.local.js'
import { store } from '../store.js'
import { SET_SEARCH_RESULTS, SET_SEARCH_TEXT, SET_SEARCH_TYPE } from './search.reducer.js'

function getCmdSetSearchText(text) {
  return { type: SET_SEARCH_TEXT, text }
}

function getCmdSetSearchType(searchType) {
  return { type: SET_SEARCH_TYPE, searchType }
}

function getCmdSetSearchResults(results) {
  return { type: SET_SEARCH_RESULTS, results }
}

// export async function loadSearchResults(txt, searchType = 'songs', numResults = 5) {
//   try {
//     store.dispatch(getCmdSetSearchText(txt))
//     store.dispatch(getCmdSetSearchType(searchType))

//     const searchFnMap = {
//       songs: stationService.sideBarSearch,
//       stations: stationService.headerSearch,
//       genre: stationService.genreSonglistSearch
//     }

//     const searchFn = searchFnMap[searchType]
//     if (!searchFn) {
//       console.warn('Unknown search type:', searchType)
//       // store.dispatch(getCmdSetSearchResults([]))
//       // return []
//     }

//     const results = await searchFn(txt, numResults)
//     store.dispatch(getCmdSetSearchResults(results))
//     return results
//   } catch (err) {
//     console.log('Cannot load search results:', err)
//     throw err
//   }
// }

export async function loadSearchResults(txt, searchType = 'songs', numResults = 5) {
  try {
    store.dispatch(getCmdSetSearchText(txt))
    store.dispatch(getCmdSetSearchType(searchType))

    let results

    if (searchType === 'songs') {
      results = await stationService.sideBarSearch(txt, numResults)
    } else if (searchType === 'stations') {
      results = await stationService.headerSearch(txt, numResults)
    } else if (searchType === 'genre') {
      results = await stationService.genreSonglistSearch(txt, numResults)
    } else {
      console.warn('Unknown search type:', searchType)
      results = []
    }

    store.dispatch(getCmdSetSearchResults(results))
    return results
  } catch (err) {
    console.log('Cannot load search results:', err)
    throw err
  }
}

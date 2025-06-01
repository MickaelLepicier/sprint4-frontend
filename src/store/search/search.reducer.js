export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS'
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT'
export const SET_SEARCH_TYPE = 'SET_SEARCH_TYPE'

const initialState = {
    searchResults: [],
    searchText: '',
    searchType: 'songs', // 'songs' | 'stations' | 'genre'
}

export function searchReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SEARCH_RESULTS:
            return { ...state, searchResults: action.results }
        case SET_SEARCH_TEXT:
            return { ...state, searchText: action.text }
        case SET_SEARCH_TYPE:
            return { ...state, searchType: action.searchType }
        default:
            return state
    }
}

import { legacy_createStore as createStore, combineReducers } from 'redux'

import { stationReducer } from './station/station.reducer'
import { userReducer } from './user/user.reducer'
import { reviewReducer } from './review/review.reducer'
import { systemReducer } from './system/system.reducer'
import { searchReducer } from './search/search.reducer'

const rootReducer = combineReducers({
    stationModule: stationReducer,
    userModule: userReducer,
    systemModule: systemReducer,
    reviewModule: reviewReducer,
    searchModule: searchReducer,
})


const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })




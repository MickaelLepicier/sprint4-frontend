import { store } from "../store"
import { LOADING_START, LOADING_DONE } from "./system.reducer"


export async function loadingStart() {
    try {
        store.dispatch({type: LOADING_START})
    } catch (err) {
        console.log('Cannot start loading', err)
        throw err
    }
}

export async function loadingDone() {
    try {
        store.dispatch({type: LOADING_DONE})
    } catch (err) {
        console.log('Cannot stop loading', err)
        throw err
    }
}

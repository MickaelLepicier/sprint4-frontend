export function MediaPlayer() {
    const currSong = useSelector(
      (storeState) => storeState.stationModule.currentSong
    )
  
    const [volume, setVolume] = useState(50)
  
    return (
      <section className="media-player-container flex align-center">
        <TrackInfo song={currSong} />
  
        <TrackControl currSong={currSong} volume={volume} />
  
        <TrackExtras
          volume={volume}
          setVolume={setVolume}
        />
      </section>
    )
  }
  

// STORE
const initialState = {
    stations: [],
    station: null, // this will get updated whenever we VISIT ***ANY*** station
    currentSong: null, // curr playing song
    currentStation: null, // curr playing station
    isPlaying: false,
    stationOrder: [],
    isShuffle: false,
    shuffledOrder: [],
  }
  

export function setIsPlaying(isPlaying) {
  try {
    store.dispatch({ type: SET_IS_PLAYING, isPlaying: !!isPlaying })
  } catch (err) {
    console.log('Cannot set isPlaying ', err)
    throw err
  }
}
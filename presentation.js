

// all the data about MediaPlayer is here: station, currentSong, currentStation, 
// I have store, and I use setSelector to use the store, In MediaPlayer for example we use isPlaying
// create a story with fue code parts that combine

// TODOs:
// [] look at the video of me speaking about the story
// [] create written script
// [] put a good song of beat that is good with the sound and with the UI (CHANGE API IF NEEDED)


// part I

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
  

// part II

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
  


// part III

export function setIsPlaying(isPlaying) {
  try {
    store.dispatch({ type: SET_IS_PLAYING, isPlaying: !!isPlaying })
  } catch (err) {
    console.log('Cannot set isPlaying ', err)
    throw err
  }
}
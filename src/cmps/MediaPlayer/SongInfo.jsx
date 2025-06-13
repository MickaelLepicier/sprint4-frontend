import like from '../../assets/icons/media-player/like_btn.svg'
import { ImageWithFallback } from '../util/ImageWithFallBack'
import { EmptyPlaylistIcon } from '../svg/EmptyPlaylistIcon'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router'

export function SongInfo({ song }) {
  // TODOs:
  // [v] add navigation on the song-title and song-artist
  // [] add likeSong btn functionality that add the song to the Liked Songs

  /*
  // If I want that always there will be a song I will put this line:

  const stations = useSelector(
    (storeState) => storeState.stationModule.stations
  )

  let currSong = { ...song }
  
  if(currSong.title === undefined && stations[0]){
    // console.log('lalalalal: ')

    const likedSongs = stations.find(station => station.name === "Liked Songs")
    const firstSong = likedSongs.songs[0]
   currSong = firstSong
  }
*/

  // navigation with onClick or NavBar:
  // song-title -> SongPage
  // song-artist -> StationPreview

  const station = useSelector((storeState) => storeState.stationModule.currentStation)

  return (
    <section className="song-info flex align-center">
      <Img song={song} />
      <div className="song-details">
        <NavLink to={`/playlist/${station?._id}`}>
          <h4 className="song-title">{song?.title || 'Unknown Song'}</h4>
        </NavLink>

        <NavLink to={``}>
          <p className="song-artist">{song?.artist || 'Unknown Artist'}</p>
        </NavLink>
      </div>
      <button className="song-like-btn">
        <img src={like} className="song-like-img" />
      </button>
    </section>
  )
}

function Img({ song }) {
  let addClassName = song ? 'song-thumbnail' : ''

  return (
    <div className="img-wrapper">
      <div className="img-bg" />
      <ImageWithFallback
        src={song?.imgUrl}
        alt={song?.title}
        className = {addClassName}
        fallback={<EmptyPlaylistIcon />}
      />
    </div>
  )
}

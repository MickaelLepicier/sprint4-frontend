import like from '../../assets/icons/media-player/like_btn.svg'
import { ImageWithFallback } from '../util/ImageWithFallBack'
import { EmptyPlaylistIcon } from '../svg/EmptyPlaylistIcon'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router'
import { LikeToggleBtn } from '../LikeToggleBtn'

export function TrackInfo({ song, isDisabled }) {
  /*
  // If I want that always there will be a song I will put this lines:

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

  const station = useSelector(
    (storeState) => storeState.stationModule.currentStation
  )
// if(!song) return null
  return (
    <section className="track-info flex align-center" style={isDisabled}>
      <Img song={song} />
      <div className="song-details">
        <NavLink to={`/playlist/${station?._id}`}>
          <h4 className="song-title">{song?.title || 'Unknown Song'}</h4>
        </NavLink>

        <NavLink to={``}>
          <p className="song-artist">{song?.artist || 'Unknown Artist'}</p>
        </NavLink>
      </div>

      {/* <button className="add-song song-like-btn">
        <img src={like} className="song-like-img" />
      </button> */}

      <LikeToggleBtn song={song} />
    </section>
  )
}

function Img({ song }) {
  let addClassName = song ? 'song-thumbnail' : ''

  return (
    <div className="icon-wrapper">
      <ImageWithFallback
        src={song?.imgUrl}
        alt={song?.title}
        className={addClassName}
        fallback={<EmptyPlaylistIcon />}
      />
    </div>
  )
}

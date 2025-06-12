import like from '../../assets/icons/media-player/like_btn.svg'
import { Fragment, useEffect } from 'react'
import { ImageWithFallback } from '../util/ImageWithFallBack'
import { EmptyPlaylistIcon } from '../svg/EmptyPlaylistIcon'
import { useSelector } from 'react-redux'

export function SongInfo({ song }) {
  // if (!song) return <div>Loading</div>
  // TODOs:
  // [] add navigation on the song-title and song-artist
  // [] add likeSong btn that add the song to the Liked Songs
  // [] make the song-like-btn work
 
  // If I want that always there will be a song I will put this line:
  // const stations = useSelector(
  //   (storeState) => storeState.stationModule.stations
  // )


let currSong = {...song}


  // If I want that always there will be a song I will put this line:

  // if(currSong.title === undefined && stations[0]){
  //   // console.log('lalalalal: ')

  //   const likedSongs = stations.find(station => station.name === "Liked Songs")
  //   const firstSong = likedSongs.songs[0]
  //  currSong = firstSong
  // }


  return (
    <section className="song-info flex align-center">
      {/* {!song && <div>There is no song selected</div>} */}

      <Fragment>

        <div className="img-wrapper">
         
          <div className="img-bg" />
          <ImageWithFallback
            src={currSong?.imgUrl}
            alt={currSong?.title}
            fallback={<EmptyPlaylistIcon />}
          />
        </div>

        <div className="song-details">
          <h4 className="song-title">{currSong?.title || 'Unknown Song'}</h4>
          <p className="song-artist">{currSong?.artist || 'Unknown Artist'}</p>
        </div>
        <button className="song-like-btn">
          <img src={like} className="song-like-img" />
        </button>
      </Fragment>
    </section>
  )
}

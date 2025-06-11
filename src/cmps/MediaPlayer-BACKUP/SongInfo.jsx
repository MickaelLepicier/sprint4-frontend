import {Fragment} from "react";

export function SongInfo({ song }) {
  // if (!song) return <div>Loading</div>
  // TODOs:
  // [] add navigation on the song-title and song-artist
  // [] add likeSong btn that add the song to the Liked Songs

  return (
    <section className="song-info flex align-center">
      {!song && <div>There is no song selected</div>}

      {song && (
        <Fragment>
          <img
            src={song?.imgUrl || 'https://i.imgur.com/N6T6vNT.jpg'}
            alt={song?.title}
            className="song-thumbnail"
          />
          <div className="song-details">
            <h4 className="song-title">{song?.title}</h4>
            <p className="song-artist">{song?.artist || 'Unknown Artist'}</p>
          </div>
        </Fragment>
      )}
    </section>
  )
}

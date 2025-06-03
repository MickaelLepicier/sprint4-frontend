import YouTube from 'react-youtube'

export function ReactYouTube({ videoId, onEnd, isPlaying, volume, playerRef }) {
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
    },
  }

  function onReady(event) {
    const player = event?.target
    if (!player) return

    if (playerRef) playerRef.current = player

    player.setVolume(volume ?? 100)

    if (isPlaying) {
      player.playVideo()
    } else {
      player.pauseVideo()
    }
  }

  return (
    <YouTube
      key={videoId}
      videoId={videoId}
      opts={opts}
      onReady={onReady}
      onEnd={onEnd}
    />
  )
}
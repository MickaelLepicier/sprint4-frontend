import { useSelector } from 'react-redux'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station'
import { LikeIcon } from './svg/LikeIcon'
import { RemoveFromLibraryIcon } from './svg/RemoveFromLibraryIcon'
import { updateStation } from '../store/station/station.actions'

export function LikeToggleBtn({ song, ...props }) {
  const user = useSelector((storeState) => storeState.userModule.user)
  const likedStationId = user?.likedSongsStationId || ''

  const likedStation = useSelector((storeState) =>
    storeState.stationModule.stations.find((station) => station._id === likedStationId)
  )
  const isLiked = likedStation?.songs?.some((s) => s.id === song?.id)

  async function onAddSongToLiked(song) {
    try {
      if (!user || !likedStationId) {
        showErrorMsg('You must be logged in to like songs.')
        return
      }

      const stationToUpdate = await stationService.getById(likedStationId)

      let updatedSongs
      if (isLiked) {
        updatedSongs = stationToUpdate.songs.filter((s) => s.id !== song.id)
        showSuccessMsg('Removed from Liked Songs')
      } else {
        updatedSongs = [song, ...stationToUpdate.songs]
        showSuccessMsg('Added to Liked Songs')
      }

      const updatedStation = { ...stationToUpdate, songs: updatedSongs }
      await updateStation(updatedStation)
    } catch (error) {
      console.log('error:', error)
      showErrorMsg(`Couldn't update song in Liked Songs`)
    }
  }

  return (
    <button
      className={`add-to-liked ${isLiked ? 'liked' : ''}`}
      title={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
      aria-label={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
      onClick={async (e) => {
        e.stopPropagation()

        await onAddSongToLiked(song)

        // Call the appropriate callback from parent
        // Use this this for SongList and ArtistSearchResult to change background correctly
        if (isLiked) {
          props.onUnlike && props.onUnlike()
        } else {
          props.onLike && props.onLike()
        }
      }}
      {...props}
    >
      {isLiked ? <RemoveFromLibraryIcon {...props} /> : <LikeIcon {...props} />}
    </button>
  )
}

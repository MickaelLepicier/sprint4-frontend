import { useSelector } from 'react-redux'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station'
import { LikeIcon } from './svg/LikeIcon'
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
        showSuccessMsg('Song Removed')
      } else {
        updatedSongs = [song, ...stationToUpdate.songs]
        showSuccessMsg('Song Added')
      }

      const updatedStation = { ...stationToUpdate, songs: updatedSongs }
      console.log('updatedStation:', updatedStation)

      await updateStation(updatedStation)
    } catch (error) {
      console.log('error:', error)
      showErrorMsg(`Couldn't add Song`)
    }
  }

  return (
    <button
      className={`add-to-liked ${isLiked ? 'liked' : ''}`}
      title="Add to Liked Songs"
      onClick={() => {
        onAddSongToLiked(song)
      }}
    >
      <LikeIcon {...props}/>
    </button>
  )
}

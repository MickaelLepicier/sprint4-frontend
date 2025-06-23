import { DeleteIcon } from "../svg/DeleteIcon"
import { RemoveFromLibraryIcon } from "../svg/RemoveFromLibraryIcon"

export function getContextMenuOptions({ user, station, onDelete, onRemoveFromLibrary }) {
    const isOwner = station.createdBy?._id === user._id
    const isLikedSongs = station._id === user.likedSongsStationId

    const options = []

    if (!isLikedSongs) {
        options.push({
            label: isOwner ? 'Delete' : 'Remove from Your Library',
            icon: isOwner
                ? <DeleteIcon />
                : <RemoveFromLibraryIcon style={{ color: 'var(--text-bright-accent, #107434)' }} />,
            onClick: () => {
                if (isOwner) {
                    onDelete(station._id)
                } else {
                    onRemoveFromLibrary(station._id)
                }
            },
        })
    }

    return options
}

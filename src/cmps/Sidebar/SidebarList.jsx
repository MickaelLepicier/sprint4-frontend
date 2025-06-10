import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SidebarPreview } from './SidebarPreview'
import { SidebarDragLabel } from './SidebarDragLabel'
import { getEmptyImage } from 'react-dnd-html5-backend'

const ItemType = 'STATION' // Used for drag-and-drop matching

function arrayMove(arr, fromIndex, toIndex) {
    const newArr = [...arr]
    const [item] = newArr.splice(fromIndex, 1)
    newArr.splice(toIndex, 0, item)
    return newArr
}

export function SidebarList({
    userStations = [],
    likedStations = [],
    likedSongsStation = {},
    likedSongsCount = 0,
    user,
    isCollapsed
}) {
    // Setup state and router
    const [orderedStations, setOrderedStations] = useState([])
    const hasInitializedSidebarStations = useRef(false)

    const navigate = useNavigate()
    const location = useLocation()

    // Get stationId from the URL (used to know which playlist is selected)
    const match = location.pathname.match(/^\/songlist\/(.+)/)
    const stationId = match?.[1].trim()
    const isPlaylistPage = !!match

    // Memoize the input data to avoid resetting order later
    const initialSidebarStations = useMemo(() => {
        const userAndLikedStations = [...userStations, ...likedStations]

        return (likedSongsStation && likedSongsCount) > 0
            ? [likedSongsStation, ...userAndLikedStations]
            : userAndLikedStations
    }, [userStations, likedStations, likedSongsStation, likedSongsCount])

    // Reset order ONLY when playlists are added or deleted (not every prop change)
    useEffect(() => {
        // If number of stations changes, update the list (keeps DnD order otherwise)
        if (orderedStations.length !== initialSidebarStations.length) {
            setOrderedStations(initialSidebarStations)
        }
    }, [initialSidebarStations, orderedStations.length])

    // Initialize sidebar stations only once after all station data is available
    // Makes sure we don’t reset the station order again when props change or the page re-renders
    useEffect(() => {
        if (hasInitializedSidebarStations.current) return
        
        if (!initialSidebarStations.length) return

        setOrderedStations(initialSidebarStations)    
        hasInitializedSidebarStations.current = true
    }, [initialSidebarStations])
    
    function onClickSonglist(stationId) {
        navigate(`songlist/${stationId}`)
    }

    // When user drags a station
    function moveStation(fromIndex, toIndex) {
        setOrderedStations(prev => arrayMove(prev, fromIndex, toIndex))
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <SidebarDragLabel />
            <section className="sidebar-list">
                <ul>
                    {orderedStations.map((station, index) => (
                        <DraggableStation
                            key={station._id}
                            index={index}
                            station={station}
                            isLikedSongs={station._id === user.likedSongsStationId}
                            isSelected={isPlaylistPage && String(stationId) === String(station._id)}
                            onClickSonglist={onClickSonglist}
                            moveStation={moveStation}
                            user={user}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </ul>
            </section>
        </DndProvider>
    )
}

function DraggableStation({ station, index, moveStation, onClickSonglist, user, isLikedSongs, isSelected, isCollapsed }) {
    const [, dragRef, preview] = useDrag({
        type: ItemType,
        item: { index, name: station.name },
    })
    
    // const [, dragRef] = useDrag({
    //     type: ItemType,
    //     item: { index, name: station.name }, // <-- ADD name!
    // })


    // const [, dragRef] = useDrag({
    //     type: ItemType,
    //     item: { index }
    // })

    // <--- This is the only change! Collect isOver from useDrop.
    const [{ isOver }, dropRef] = useDrop({
        accept: ItemType,
        drop(item) {
            if (item.index !== index) {
                moveStation(item.index, index)
                item.index = index
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    })

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [preview])
    // const [, dropRef] = useDrop({
    //     accept: ItemType,
    //     drop(item) {
    //     if (item.index !== index) {
    //         moveStation(item.index, index)  // Move item to new idx
    //         item.index = index // Update dragged item’s idx for internal tracking
    //     }
    //     }
    // })

    const setDragRef = node => dragRef(dropRef(node))

    return (
        <SidebarPreview
            songlist={{
                title: station.name,
                imgUrl: station.imgUrl,
                songCount: station.songs.length,
                _id: station._id,
                isLiked: !!station.isLiked,
                createdById: station.createdBy?._id
            }}
            isLikedSongs={isLikedSongs}
            isSelected={isSelected}
            isCollapsed={isCollapsed}

            userId={user._id}
            userFirstName={user?.fullname?.split(' ')[0]}

            onClickSonglist={onClickSonglist}
            setDragRef={setDragRef}
            isOver={isOver}
        />
    )
}

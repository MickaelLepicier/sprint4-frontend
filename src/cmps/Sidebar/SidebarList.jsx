import { useState, useEffect, useMemo} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,useLocation} from 'react-router-dom'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend'

import { SidebarPreview } from './SidebarPreview'
import { SidebarDragLabel } from './SidebarDragLabel'
import { removeStation, setStationOrder} from '../../store/station/station.actions'
import { showErrorMsg } from '../../services/event-bus.service'
import { swapItems } from '../../services/util.service'

const ItemType = 'STATION'

export function SidebarList({
  stations = [],
  user,
  isCollapsed,
}) {
    const initialContextMenu = {
      show: false,
      x: 0,
      y: 0,
      itemId: null,
    }
    const stationOrder = useSelector(state => state.stationModule.stationOrder)
    const [contextMenu, setContextMenu] = useState(initialContextMenu)
    
    const navigate = useNavigate()
    const location = useLocation()

    const match = location.pathname.match(/^\/playlist\/(.+)/)
    const stationId = match?.[1].trim()

    const orderedStations = useMemo(() => {
      const map = Object.fromEntries(stations.map(s => [s._id, s]))
      return stationOrder.map(id => map[id]).filter(Boolean)
    }, [stations, stationOrder])

    useEffect(() => {
      const orderedIds = orderedStations.map(s => s._id)
      const actualIds = stations.map(s => s._id)
      const mismatch =
        orderedIds.length !== actualIds.length ||
        !actualIds.every(id => orderedIds.includes(id))

      if (mismatch) {
        setStationOrder(actualIds)
      }
    }, [stations, orderedStations])

    function moveStation(fromIndex, toIndex) {
      const newOrder = swapItems(orderedStations, fromIndex, toIndex).map(s => s._id)
      setStationOrder(newOrder)
    }

    async function onDeleteStation(stationId) {
        try {
            await removeStation(stationId)
        } catch {
            showErrorMsg('Could not remove station')
        }
    }

    function onClickSonglist(stationId) {
        navigate(`/playlist/${stationId}`)
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
                          moveStation={moveStation}
                          onClickSonglist={onClickSonglist}
                          user={user}
                          isCollapsed={isCollapsed}
                          isLikedSongs={station._id === user.likedSongsStationId}
                          isSelected={String(stationId) === String(station._id)}
                          contextMenu={contextMenu}
                          setContextMenu={setContextMenu}
                          initialContextMenu={initialContextMenu}
                          onDeleteStation={onDeleteStation}
                        />
                    ))}
                </ul>
            </section>
        </DndProvider>
    )
}

function DraggableStation({
  station,
  index,
  moveStation,
  onClickSonglist,
  user,
  isLikedSongs,
  isSelected,
  isCollapsed,
  contextMenu,
  setContextMenu,
  initialContextMenu,
  onDeleteStation,
}) {
    const [, dragRef, preview] = useDrag({
        type: ItemType,
        item: { index, name: station.name }
    })

    const [{ isOver }, dropRef] = useDrop({
        accept: ItemType,
        drop(item) {
            if (item.index !== index) {
                moveStation(item.index, index)
                item.index = index
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    })

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [preview])

    const setDragRef = node => dragRef(dropRef(node))

    return (
        <SidebarPreview
          station={station}
          isLikedSongs={isLikedSongs}          
          isSelected={isSelected}
          isCollapsed={isCollapsed}
          userId={user._id}
          userFirstName={user?.fullname?.split(' ')[0]}
          onClickSonglist={onClickSonglist}
          setDragRef={setDragRef}
          isOver={isOver}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          initialContextMenu={initialContextMenu}
          onDeleteStation={onDeleteStation}
        />
    )
}

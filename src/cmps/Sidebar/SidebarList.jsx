import { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,useLocation} from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { SidebarPreview } from './SidebarPreview'
import { SidebarDragLabel } from './SidebarDragLabel'
import { ContextMenu } from '../ContextMenu'
import { useStationDnD } from '../../hooks/useStationDnD'
import { getContextMenuOptions } from './ContextMenuOpts'
import { removeStation, setStationOrder} from '../../store/station/station.actions'
import { updateUser } from '../../store/user/user.actions'
import { showErrorMsg } from '../../services/event-bus.service'
import { swapItems } from '../../services/util.service'
import { DeleteIcon } from '../svg/DeleteIcon'

const ItemType = 'STATION'

export function SidebarList({
  stations = [],
  user,
  isCollapsed,
}) {
    const stationOrder = useSelector(state => state.stationModule.stationOrder)
    const [contextMenu, setContextMenu] = useState(null)

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

    function onClickSonglist(stationId) {
      navigate(`/playlist/${stationId}`)
    }
    
    function getOptionsForContextMenu() {
      if (!contextMenu?.station) return []

      return getContextMenuOptions({
        user,
        station: contextMenu.station,
        onDelete: onDeleteStation,
        onRemoveFromLibrary,
      })
    }
   
    async function onDeleteStation(stationId) {
        try {
            await removeStation(stationId)
        } catch {
            showErrorMsg('Could not remove station')
        }
    }

    async function onRemoveFromLibrary(stationId) {
      try {
        const updatedLikedStationIds = user.likedStationIds.filter(id => id !== stationId)

        const updatedUser = {
          ...user,
          likedStationIds: updatedLikedStationIds
        }

        await updateUser(updatedUser)

        const newOrder = stationOrder.filter(id => id !== stationId)
        setStationOrder(newOrder)
      } catch (err) {
        showErrorMsg('Could not remove station from your library')
      }
    }

    function handleContextMenu(ev, station) {
        ev.preventDefault()
        ev.stopPropagation()

        if (contextMenu?.station?._id === station._id) {
            setContextMenu(null)
            return
        }

        setContextMenu({ x: ev.clientX, y: ev.clientY, station })
    }

    function handleCloseContextMenu() {
      setContextMenu(null)
    }

    useEffect(() => {
      function handleClickOutside(ev) {
        if (ev.button === 0) {
          setContextMenu(null)
        }
      }

      function handleContextMenuOutside(ev) {
          ev.preventDefault()
          setContextMenu(null)
        }

      if (contextMenu) {
        window.addEventListener('click', handleClickOutside)
        window.addEventListener('contextmenu', handleContextMenuOutside)
      }

      return () => {
        window.removeEventListener('click', handleClickOutside)
        window.removeEventListener('contextmenu', handleContextMenuOutside)
      }
    }, [contextMenu])

    return (
      <>
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
                          onContextMenu={handleContextMenu}
                        />
                    ))}
                </ul>
            </section>
        </DndProvider>

       {contextMenu?.station && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
            options={getOptionsForContextMenu()}
        />
        )}
      </>
    )
}

function DraggableStation({ station, index, moveStation, onContextMenu, ...rest }) {
    const { setDragRef, isOver } = useStationDnD(index, moveStation, station)

    return (
        <SidebarPreview
            station={station}
            setDragRef={setDragRef}
            isOver={isOver}
            onContextMenu={onContextMenu}
            {...rest}
        />
    )
}


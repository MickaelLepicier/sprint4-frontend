import { useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

export function useStationDnD(index, moveStation) {
    const [, dragRef, preview] = useDrag({
        type: 'STATION',
        item: { index },
    })

    const [{ isOver }, dropRef] = useDrop({
        accept: 'STATION',
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

    const setDragRef = node => dragRef(dropRef(node))

    return { setDragRef, isOver }
}

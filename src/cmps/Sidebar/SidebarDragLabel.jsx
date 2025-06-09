import { useDragLayer } from 'react-dnd'

export function SidebarDragLabel() {
    const { isDragging, item, currentOffset } = useDragLayer(monitor => ({
        isDragging: monitor.isDragging(),
        item: monitor.getItem(),
        currentOffset: monitor.getClientOffset(),
    }))

    if (!isDragging || !item || !currentOffset) return null

    const style = {
        pointerEvents: 'none',
        position: 'fixed',
        top: currentOffset.y - 2,
        left: currentOffset.x + 8,
        zIndex: 10000,
    }

    return (
        <div style={style} className="sidebar-drag-label">
            {item.name}
        </div>
    )
}
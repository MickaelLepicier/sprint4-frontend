import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

export function ContextMenu({ x, y, options = [], onClose }) {
    const menuRef = useRef()

    useEffect(() => {
        function handleClickOutside(ev) {
            if (menuRef.current && !menuRef.current.contains(ev.target)) {
                onClose()
            }
        }

        function handleContextMenuOutside(ev) {
            if (menuRef.current && !menuRef.current.contains(ev.target)) {
                ev.preventDefault()
                onClose()
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('contextmenu', handleContextMenuOutside)

        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('contextmenu', handleContextMenuOutside)
        }
    }, [onClose])

    return ReactDOM.createPortal(
        <div className="context-menu-wrapper" style={{ position: 'absolute', top: y, left: x, zIndex: 20 }}>
            <ul className="station-context-menu">
                {options.map(({ label, icon, onClick }) => (
                    <li role="presentation" key={label}>
                        <button
                            role="menuitem"
                            tabIndex="-1"
                            onClick={() => {
                                onClick()
                                onClose()
                            }}
                        >
                            {icon && icon}
                            <span>{label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>,
        document.body
    )
}

import { CreateIcon } from '../svg/CreateIcon'
import { CollapseLibraryIcon } from '../svg/CollapseLibraryIcon'
import { ExpandLibraryIcon } from '../svg/ExpandLibraryIcon'
import { LibraryIcon } from '../svg/LibraryIcon'

export function SidebarHeader({
    onCreateStation,
    isCollapsed,
    onToggleCollapse,
    isCompactCreateBtn
}) {

    return (
    <header className="sidebar-header">
        <div className="header-actions">
            <button
                className="sidebar-collapse-btn"
                aria-label={isCollapsed ? 'Expand Your Library' : 'Collapse Your Library'}
                onClick={onToggleCollapse}
                tabIndex={0}
            >
                {/* Change icon based on collapsed state */}
                {isCollapsed ? (
                    <>
                        <LibraryIcon />
                        <ExpandLibraryIcon />
                    </>
                ) : (
                    <CollapseLibraryIcon />
                )}

                {/* Show text only when not collapsed */}
                {!isCollapsed && <h1 className="your-library-title">Your Library</h1>}
            </button>

            <button 
                className={`create-btn ${isCompactCreateBtn ? 'compact' : ''}`}
                aria-label="Create songlist or folder" 
                onClick={onCreateStation}>
                <span className="icon"><CreateIcon /></span>
                <span className="label">Create</span>
            </button>
        </div>
    </header>
  )
}

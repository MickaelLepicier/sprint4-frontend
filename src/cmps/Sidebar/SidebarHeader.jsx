import { CreateIcon } from "../svg/CreateIcon";

export function SidebarHeader() {
    return (
        <header className="sidebar-header">
            <div className="header-actions">
                <h1>Your Library</h1>
                <button className="create-btn" aria-label="Create playlist or folder">
                    <span className="icon">
                        <CreateIcon />
                    </span>
                    <span className="label">Create</span>
                </button>
            </div>
        </header>
    )
}

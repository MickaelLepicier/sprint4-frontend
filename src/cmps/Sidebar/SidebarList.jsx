import { SidebarPreview } from './SidebarPreview.jsx'

export function SidebarList({ playlists }) {
    if (!playlists.length) return <section className="sidebar-list empty">No playlists to render.</section>
    
    return (
        <section className="sidebar-list">
            {playlists.map(playlist => (
                <SidebarPreview key={playlist.id} playlist={playlist} />
            ))}
        </section>
    )
}

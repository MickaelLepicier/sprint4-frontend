export function SidebarFilterSort({ searchTerm, setSearchTerm }) {
    return (
        <section className="sidebar-filter-sort">
            <input
                type="text"
                className="library-search-input"
                placeholder="Search in Your Library"
                value={searchTerm}
                onChange={ev => setSearchTerm(ev.target.value)}
                aria-label="Type to filter your library"
            />
            {/* <button class="search-icon-btn" aria-label="Search in Your Library">
                🔍
            </button>    */}
        </section>
    )
}

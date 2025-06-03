export function SidebarFilterSort() {
    return (
        <section className="sidebar-filter-sort">
            <input
                type="text"
                className="library-search-input"
                placeholder="Search in Your Library"
                aria-label="Type to filter your library. The list of content below will update as you type."
            />
            {/* <button class="search-icon-btn" aria-label="Search in Your Library">
                🔍
            </button>    */}
        </section>
    )
}

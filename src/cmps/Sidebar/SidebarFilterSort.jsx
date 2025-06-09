import { useRef, useState } from "react"
import { SearchIcon } from "../svg/SearchIcon"

export function SidebarFilterSort({ searchTerm, setSearchTerm }) {
    const [active, setActive] = useState(false)
    const searchInputRef = useRef(null)

    function openSearch() {
        setActive(true)
        setTimeout(() => searchInputRef.current?.focus(), 10)
    }

    function closeSearch() {
        if (!searchTerm) setActive(false)
    }

    return (
        <section className="sidebar-filter-sort">
            <input
                ref={searchInputRef}
                type="text"
                className={`library-search-input${active ? " active" : ""}`}
                placeholder="Search in Your Library"
                value={searchTerm}
                onChange={ev => setSearchTerm(ev.target.value)}
                onBlur={closeSearch}
                aria-label="Type to filter your library"
            />

            <button
                className="search-icon-btn flex align-center justify-center"
                aria-label="Search in Your Library"
                type="button"
                onClick={openSearch}
            >
                <SearchIcon />
            </button>   
        </section>
    )
}

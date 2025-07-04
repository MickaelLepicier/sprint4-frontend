export function ExpandLibraryIcon({ className = '' }) {
    return (
        <svg
            className={`expand-library-icon ${className}`}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M14.457 15.207a1 1 0 0 1-1.414-1.414L14.836 12l-1.793-1.793a1 1 0 0 1 1.414-1.414l2.5 2.5a1 1 0 0 1 0 1.414l-2.5 2.5Z"></path>
            <path d="M20 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16ZM4 20V4h4v16H4Zm16 0H10V4h10v16Z"></path>
        </svg>
    )
}

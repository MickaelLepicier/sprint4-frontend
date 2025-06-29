export function SearchIcon({ size = 16, color = 'currentColor', ...props }) {
    return (
        <svg
            className="search-icon"
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            viewBox="0 0 16 16"
            margin='0'
            width={size}
            height={size}
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zM.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7z"></path>
        </svg>
    )
}

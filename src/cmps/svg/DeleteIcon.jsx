export function DeleteIcon({ size = 16, color = 'currentColor', ...props }) {
    return (
        <svg
            className="delete-icon"
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill="none"
            {...props}
        >
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8" fill={color} />
            <path d="M12 8.75H4v-1.5h8z" fill={color} />
        </svg>
    )
}

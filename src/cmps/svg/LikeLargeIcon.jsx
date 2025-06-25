export function LikeLargeIcon({ size = 32, color = 'currentColor', ...props }) {
    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className="like-large-icon"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11" />
            <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1" />
        </svg>
    )
}

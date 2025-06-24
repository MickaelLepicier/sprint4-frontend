export function PlayStandardIcon({ className = '', size = 16, color = 'currentColor', ...props }) {
    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className={`play-standard-icon ${className}`.trim()}
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"></path>
        </svg>
    )
}

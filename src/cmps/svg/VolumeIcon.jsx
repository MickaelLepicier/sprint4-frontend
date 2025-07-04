export function VolumeIcon({ className = '', size = 16, color = 'currentColor', ...props }) {
    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`volume-icon ${className}`.trim()}
            width={size}
            height={size}
            fill="none"
            {...props}
        >
            <path
                d="M10.016 1.125A.75.75 0 0 0 8.99.85l-6.925 4a3.64 3.64 0 0 0 0 6.299l6.925 4a.75.75 0 0 0 1.125-.65v-13a.75.75 0 0 0-.1-.375zM11.5 5.56a2.75 2.75 0 0 1 0 4.88z"
                fill={color}
            />
            <path
                d="M16 8a5.75 5.75 0 0 1-4.5 5.614v-1.55a4.252 4.252 0 0 0 0-8.127v-1.55A5.75 5.75 0 0 1 16 8"
                fill={color}
            />
        </svg>
    )
}

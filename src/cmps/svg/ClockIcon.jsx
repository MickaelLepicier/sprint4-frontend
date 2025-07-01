export function ClockIcon({ size = 16, color = 'currentColor', ...props }) {
    return (
        <svg
            className="clock-icon"
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
            <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25"></path>
        </svg>
    )
}

export function PenIcon({ size = 24, color = 'currentColor', ...props }) {

    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className="pen-icon"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="M17.318 1.975a3.329 3.329 0 1 1 4.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 0 1-1.28-1.28l1.581-4.376a4.7 4.7 0 0 1 1.103-1.735zm3.293 1.414a1.33 1.33 0 0 0-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.7 2.7 0 0 0 1.001-.636L20.611 5.268a1.33 1.33 0 0 0 0-1.879" />
        </svg>
    )
}

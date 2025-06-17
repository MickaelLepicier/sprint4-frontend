export function PlayIcon(props) {
    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="play-icon"
            {...props}
        >
                
            <path 
            // d="M3 2l10 6-10 6V2z" 
            // d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" 
            d={props.path} 
        
            />
            
        </svg>
    )
}

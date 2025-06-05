export function SetActionBtn({imgSrc, str, onClick = () => null, dis = false}) {
    return (
      <button className={`track-action ${str}`} onClick={onClick} disabled={dis}>
        <img src={imgSrc} alt={str} />
      </button>
    )
  }
export function SetActionBtn({ currIcon, addClassName = '', onClick = () => null, dis = false }) {

  return (
    <button className={`btn-wrapper ${addClassName}`} onClick={onClick} disabled={dis}>
      {currIcon}
    </button>
  )
}

import { useEffect } from 'react'
import Color from 'color-thief-react'

function SetDominantColor({ color, onSetColor }) {
  useEffect(() => {
    if (color) onSetColor(color)
  }, [color, onSetColor])

  return null
}

export function DominantColorExtractor({ imgUrl, onSetColor }) {
  if (!imgUrl) return null

  return (
    <Color src={imgUrl} crossOrigin="anonymous" format="hex">
      {({ data, loading }) => {
        if (loading || !data) return null
        return <SetDominantColor color={data} onSetColor={onSetColor} />
      }}
    </Color>
  )
}

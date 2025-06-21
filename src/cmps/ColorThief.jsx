import { useEffect } from 'react'
import Color from 'color-thief-react'

function DominantColorHandler({ color, onColorReady }) {
  useEffect(() => {
    if (color) onColorReady?.(color)
  }, [color, onColorReady])

  return null
}

export function ColorThief({ imgSrc, onColorReady }) {
  return (
    <div>
      <Color src={imgSrc} crossOrigin="anonymous" format="hex">
        {({ data, loading }) => {
          if (loading || !data) return null
          return <DominantColorHandler color={data} onColorReady={onColorReady} />
        }}
      </Color>
    </div>
  )
}



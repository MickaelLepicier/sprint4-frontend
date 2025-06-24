export function makeId(length = 6) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

export function makeLorem(size = 100) {
  var words = [
    'The sky',
    'above',
    'the port',
    'was',
    'the color of television',
    'tuned',
    'to',
    'a dead channel',
    '.',
    'All',
    'this happened',
    'more or less',
    '.',
    'I',
    'had',
    'the story',
    'bit by bit',
    'from various people',
    'and',
    'as generally',
    'happens',
    'in such cases',
    'each time',
    'it',
    'was',
    'a different story',
    '.',
    'It',
    'was',
    'a pleasure',
    'to',
    'burn',
  ]
  var txt = ''
  while (size > 0) {
    size--
    txt += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return txt
}

export function cleanTitle(str, maxLen = 35) {
  if (!str) return ''
  let cleaned = str.replace(/[^\w\s\-,.()]/g, '')
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  if (cleaned.length > maxLen) {
    cleaned = cleaned.slice(0, maxLen).trim() + '...'
  }
  return cleaned
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

export function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

export function swapItems(arr, indexA, indexB) {
  const newArr = [...arr]
  const temp = newArr[indexA]
  newArr[indexA] = newArr[indexB]
  newArr[indexB] = temp
  return newArr
}

export async function isValidImg(url) {
    return new Promise(resolve => {
        const img = new Image()

        img.onload = () => {
            const isFallbackSize = img.naturalWidth === 161 && img.naturalHeight === 81
            resolve(!isFallbackSize)
        }

        img.onerror = () => resolve(false)

        img.src = url
    })
}

export function getApproximateSpotifyColor(hex) {
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)

    let [h, s, l] = rgbToHsl(r, g, b)

    // Stronger saturation boost
    s = Math.min(1, s * 1.8)

    // Darker midtones, lighter darks
    l = l > 0.6 ? l * 0.85 : l * 0.75

    // Sharper hue shifts
    if (h > 0.5 && h < 0.75) h -= 0.08
    if (h < 0.08) h += 0.03

    const [r2, g2, b2] = hslToRgb(h, s, l)
    return `rgb(${Math.round(r2)}, ${Math.round(g2)}, ${Math.round(b2)})`
}


// export function enhanceColor(hex, brightness = 1.2, saturation = 1.2) {
//   const r = parseInt(hex.slice(1, 3), 16)
//   const g = parseInt(hex.slice(3, 5), 16)
//   const b = parseInt(hex.slice(5, 7), 16)

//   const brightened = [
//     Math.min(255, r * brightness),
//     Math.min(255, g * brightness),
//     Math.min(255, b * brightness)
//   ]

//   const [h, s, l] = rgbToHsl(...brightened)
//   const [r2, g2, b2] = hslToRgb(h, s * saturation, l)

//   return `rgba(${Math.round(r2)}, ${Math.round(g2)}, ${Math.round(b2)}, 1)`
// }

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [h, s, l]
}

function hslToRgb(h, s, l) {
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r * 255, g * 255, b * 255]
}

export function calcStationDuration(songs) {
  if (!songs?.length) return null

  const hasValidDurations = songs.every(song => typeof song.duration === 'number' && song.duration > 0)
  if (!hasValidDurations) return null

  const totalSec = songs.reduce((sum, song) => sum + song.duration, 0)
  return _formatAsAboutDuration(totalSec)
}

function _formatAsAboutDuration(totalSec) {
  const hr = Math.floor(totalSec / 3600)
  const min = Math.floor((totalSec % 3600) / 60)
  const sec = totalSec % 60

  if (hr > 0) {
    if (min > 0) return `about ${hr} hr ${min} min`
    return `about ${hr} hr`
  }

  // When 45~60 minutes or seconds are under 15, show only the minutes
  if (min >= 45 || sec < 15) {
    return `about ${Math.round(totalSec / 60)} min`
  }

  return `${min} min ${sec} sec`
}


function getRandomFormattedDate(start = new Date(2020, 0, 1), end = new Date()) {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  const date = new Date(randomTime);

  const month = date.getMonth() + 1; // months are 0-based
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}
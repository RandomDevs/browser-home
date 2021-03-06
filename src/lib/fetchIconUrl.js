const MINIMUM_ICON_SIZE = 50 * 50

async function getRealIconSize(url) {

  try {
    const size = await new Promise((resolve, reject) => {

      const image = new Image()
      image.onload = () => resolve(image.width * image.height)
      image.onerror = () => reject(new Error(`Something went wrong when downloading icon ${url}`))
      image.src = url
    })

    return size
  } catch (err) {
    console.error(err)
  }

  return null
}

function calculateTotalSize(sizes) {

  if (!sizes) {
    return null
  }

  const [width, height] = sizes.split('x')
  return parseInt(width, 10) * parseInt(height, 10)
}

function getLargestIconFromList(list) {

  return Array.from(list).reduce((largestIcon, icon) => {

    const size = calculateTotalSize(icon.getAttribute('sizes'))

    if (largestIcon === null || size > largestIcon.size) {
      return { href: icon.getAttribute('href'), size }
    }

    return largestIcon
  }, null)
}

async function fetchIconUrl(url, inBrowser = true, { fetch, DOMParser }) {

  // Use IOS user agent since a lot of web servers only serve icons if client is IOS
  const headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A356 Safari/604.1', // eslint-disable-line max-len
  }

  const response = await fetch(url, { mode: 'no-cors', headers, timeout: 5000 })
  const realUrl = response.url

  if (response.status !== 200) {
    console.error(`Grab icon returned HTTP status ${response.status}`, response)
    return null
  }

  const html = await response.text()
  const parser = new DOMParser()
  const parsedDoc = parser.parseFromString(html, 'text/html')

  const appleTouchIconPrecomposed = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='apple-touch-icon-precomposed']"))
  const appleTouchIcon = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='apple-touch-icon']"))
  const shortcutIcon = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='shortcut icon']"))
  const icon = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='icon']"))
  const fluidIcon = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='fluid-icon']"))

  const availableIcons = [appleTouchIconPrecomposed, appleTouchIcon, shortcutIcon, icon, fluidIcon]
    .filter((currentIcon) => currentIcon !== null)
    .map((currentIcon) => (new URL(currentIcon.href, realUrl)).href)

  if (availableIcons.length === 0) {
    return null
  }

  if (!inBrowser) {
    return availableIcons[0]
  }

  const availableIconSizes = await Promise.all(availableIcons.map((iconHref) => getRealIconSize(iconHref)))

  const iconsBySize = availableIcons
    .map((href, index) => ({ href, size: availableIconSizes[index] }))
    .filter(({ size }) => size > MINIMUM_ICON_SIZE)
    .sort((a, b) => b.size - a.size)

  if (iconsBySize.length === 0) {
    return null
  }

  return iconsBySize[0].href
}

module.exports = {
  fetchIconUrl,
}

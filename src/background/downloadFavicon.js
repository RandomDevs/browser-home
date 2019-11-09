async function getFavicon(faviconUrl, { fetch }) {

  const response = await fetch(faviconUrl)
  const blob = await response.blob()
  return convertBlobToBase64(blob)
}

async function saveFavicon(faviconUrl, outputDirectoryPath, { fetch, fs, path }) {

  const response = await fetch(faviconUrl, { timeout: 5000 })
  const buffer = await response.buffer()
  const contentType = response.headers.get('content-type')
  const extension = extensionFromContentType(contentType)
  const hash = Math.random().toString(36).substring(7)
  const filename = `${hash}.${extension}`
  const outputFilepath = path.join(outputDirectoryPath, filename)

  await fs.writeFile(outputFilepath, buffer)

  return filename
}

function extensionFromContentType(contentType) {

  switch (contentType.toLowerCase()) {

    case 'image/png':
      return 'png'

    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg'

    case 'image/gif':
      return 'gif'

    default:
      throw new UnhandledContentTypeError('Unhandled content type', contentType)
  }
}

function convertBlobToBase64(blob) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

class UnhandledContentTypeError extends Error {}

module.exports = {
  getFavicon,
  saveFavicon,
  UnhandledContentTypeError,
}
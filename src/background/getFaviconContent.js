
async function getFaviconContent(faviconUrl) {

  const response = await fetch(faviconUrl)
  const blob = await response.blob()
  return convertBlobToBase64(blob)
}

function convertBlobToBase64(blob) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

module.exports = {
  getFaviconContent,
}

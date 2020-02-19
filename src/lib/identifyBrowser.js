
const TYPE_CHROME = 'chrome'
const TYPE_FIREFOX = 'firefox'
const TYPE_EDGE = 'edge'

function identifyBrowser() {

  const { userAgent } = navigator

  // This order matters. Edge user agent contains Chrome.

  if (/Edg/.test(userAgent)) {
    return TYPE_EDGE
  }

  if (/Chrome/.test(userAgent)) {
    return TYPE_CHROME
  }

  return TYPE_FIREFOX
}

module.exports = {
  TYPE_CHROME,
  TYPE_EDGE,
  TYPE_FIREFOX,
  identifyBrowser,
}

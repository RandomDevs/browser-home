
const TYPE_CHROME = 'chrome'
const TYPE_FIREFOX = 'firefox'

function identifyBrowser() {

  if (typeof window.chrome !== 'undefined') {
    return TYPE_CHROME
  }

  return TYPE_FIREFOX
}

module.exports = {
  TYPE_CHROME,
  TYPE_FIREFOX,
  identifyBrowser,
}

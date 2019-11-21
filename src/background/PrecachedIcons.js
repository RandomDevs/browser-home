const { cleanDomainNameFromUrl } = require('../lib/cleanDomainNameFromUrl')

const PATH = '/precached-icons'

async function fetchPrecachedIcons() {

  try {

    const response = await fetch(`${PATH}/domains.json`)
    const json = await response.json()
    return json

  } catch (error) {

    console.error('Got error while fetching precached icon store, returning empty store')
    return {}
  }
}

class PrecachedIcons {

  async init() {
    this.store = await fetchPrecachedIcons()
  }

  getIconPathFromUrl(url) {

    const domain = cleanDomainNameFromUrl(url)
    if (domain in this.store) {
      return `${PATH}/${this.store[domain]}`
    }

    return null
  }
}

module.exports = {
  PrecachedIcons,
}

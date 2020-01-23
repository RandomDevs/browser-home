const { fetchIconUrl } = require('../lib/fetchIconUrl')
const { getIcon } = require('../lib/downloadIcon')
const { PrecachedIcons } = require('./PrecachedIcons')
const { storeVersion, defaultStore } = require('../config')
const { isBookmarkInFolder } = require('../lib/isBookmarkInFolder')
const { IconStore } = require('../lib/IconStore')
const { flatternTree } = require('../lib/bookmarkHelpers')
const messageTypes = require('../lib/messageTypes')

async function shouldRefreshStore() {

  const store = await browser.storage.local.get('store_version')
  const version = store.store_version || 0

  if (version < storeVersion) {

    await browser.storage.local.set({ store_version: storeVersion })
    return true
  }

  return false
}

async function getConfigStore() {

  const store = await browser.storage.local.get(Object.keys(defaultStore))

  for (const key of Object.keys(defaultStore)) {
    if (!(key in store)) {

      const value = defaultStore[key]
      console.log(`Setting default value ${key} = ${value}`)

      await browser.storage.local.set({ [key]: value }) // eslint-disable-line no-await-in-loop
    }
  }

  return browser.storage.local.get(Object.keys(defaultStore))
}

class BackgroundJob {

  async updateIcon({ id, url }) {

    const precachedIconPath = this.precachedIcons.getIconPathFromUrl(url)
    const iconUrl = precachedIconPath || await fetchIconUrl(url, true, { fetch, DOMParser })
    const iconData = await getIcon(iconUrl, { fetch })

    await this.storeIcon(id, iconData)
  }

  async handleUpdatedBookmark(bookmarkId) {

    if (!isBookmarkInFolder(this.configStore.bookmarkFolderId, bookmarkId)) {
      return
    }

    const [bookmark] = await browser.bookmarks.get(bookmarkId)
    this.updateIcon(bookmark)
  }

  async handleUpdatedBookmarkFolder() {

    const tree = await browser.bookmarks.getSubTree(this.configStore.bookmarkFolderId)
    const bookmarks = flatternTree(tree[0])

    console.log('Started download for updated folder')

    for (const bookmark of bookmarks) {

      console.log(`Downloading icon for ${bookmark.title}`)

      // Download icons in serial, too many parallell downloads
      try {
        await this.updateIcon(bookmark) // eslint-disable-line no-await-in-loop
      } catch (err) {
        console.error(`Could not download icon for ${bookmark.title}`)
      }
    }

    console.log('Done downloading icons')
  }

  addListeners() {

    const listener = this.handleUpdatedBookmark.bind(this)
    browser.bookmarks.onCreated.addListener(listener)
    browser.bookmarks.onMoved.addListener(listener)
    browser.bookmarks.onChanged.addListener(listener)

    browser.storage.onChanged.addListener((param) => {

      if ('bookmarkFolderId' in param) {

        this.configStore.bookmarkFolderId = param.bookmarkFolderId.newValue
        this.handleUpdatedBookmarkFolder()
      }
    })

    browser.runtime.onMessage.addListener(event => this.handleMessage(event))
  }

  handleMessage(event) {

    console.log(`Got event with type ${event.type}`)

    switch (event.type) {
      case messageTypes.FETCH_ICON:

        this.storeIcon(event.bookmarkId, null)
        return this.handleUpdatedBookmark(event.bookmarkId)

      case messageTypes.CUSTOM_ICON:
        return this.storeIcon(event.bookmarkId, event.imageData)

      default:
        return null
    }
  }

  async init() {

    this.configStore = await getConfigStore()

    this.precachedIcons = new PrecachedIcons()
    await this.precachedIcons.init()

    const iconStore = new IconStore(this.configStore.bookmarkFolderId, browser.storage.local)
    await iconStore.cleanup()
    this.storeIcon = (id, data) => iconStore.store(id, data)

    this.addListeners()

    const refreshStore = await shouldRefreshStore()
    if (refreshStore) {
      console.log('Trigger new store refresh')
      this.handleUpdatedBookmarkFolder()
    }

    console.log('Extension is loaded')
  }

}

const job = new BackgroundJob()
job.init()

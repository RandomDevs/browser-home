const { fetchIconUrl } = require('../lib/fetchIconUrl')
const { getIcon } = require('../lib/downloadIcon')
const { setBookmarkFolderIfNotExists } = require('./bookmarkFolder')
const { PrecachedIcons } = require('./PrecachedIcons')
const { storeVersion } = require('./config')
const { isBookmarkInFolder } = require('../lib/isBookmarkInFolder')
const { IconStore } = require('../lib/IconStore')

async function shouldRefreshStore() {

  const store = await browser.storage.local.get('store_version')
  const version = store.store_version || 0

  if (version < storeVersion) {

    await browser.storage.local.set({ store_version: storeVersion })
    return true
  }

  return false
}

function transformBookmarkTreeToBookmarkList(folder) {

  if (folder.children.length > 0) {

    return folder.children.reduce((acc, child) => {

      if (child.type === 'folder') {
        return [...acc, ...transformBookmarkTreeToBookmarkList(child)]
      }

      return [...acc, child]
    }, [])
  }

  return []
}

class BackgroundJob {

  async updateIcon({ id, url }) {

    const precachedIconPath = this.precachedIcons.getIconPathFromUrl(url)
    const iconUrl = precachedIconPath || await fetchIconUrl(url, true, { fetch, DOMParser })
    const iconData = await getIcon(iconUrl, { fetch })

    await this.storeIcon(id, iconData)
  }

  async handleUpdatedBookmark(bookmarkId) {

    if (!isBookmarkInFolder(this.bookmarkFolderId, bookmarkId)) {
      return
    }

    const [bookmark] = await browser.bookmarks.get(bookmarkId)
    this.updateIcon(bookmark)
  }

  async handleUpdatedBookmarkFolder() {

    const tree = await browser.bookmarks.getSubTree(this.bookmarkFolderId)
    const bookmarks = transformBookmarkTreeToBookmarkList(tree[0])

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

    browser.storage.onChanged.addListener((param) => {

      if ('bookmarkFolderId' in param) {

        this.bookmarkFolderId = param.bookmarkFolderId.newValue
        this.handleUpdatedBookmarkFolder()
      }
    })
  }

  async init() {

    this.precachedIcons = new PrecachedIcons()
    await this.precachedIcons.init()

    this.bookmarkFolderId = await setBookmarkFolderIfNotExists()

    const iconStore = new IconStore(this.bookmarkFolderId, browser.storage.local)
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

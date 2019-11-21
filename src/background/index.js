const { fetchFaviconUrl } = require('../lib/fetchFaviconUrl')
const { getFavicon } = require('../lib/downloadFavicon')
const { setBookmarkFolderIfNotExists } = require('./bookmarkFolder')
const { PrecachedIcons } = require('./PrecachedIcons')
const { storeVersion } = require('./config')

async function shouldRefreshStore() {

  const store = await browser.storage.local.get('store_version')
  const version = store.store_version || 0

  if (version < storeVersion) {

    await browser.storage.local.set({ store_version: storeVersion })
    return true
  }

  return false
}

function searchBookmarksTreeForId(tree, bookmarkId) {

  for (const bookmark of tree) {

    let searchResult

    if (bookmark.type === 'folder') {
      searchResult = searchBookmarksTreeForId(bookmark.children, bookmarkId)
    } else {
      searchResult = bookmark.id === bookmarkId
    }

    if (searchResult === true) {
      return true
    }
  }

  return false
}

async function isBookmarkInFolder(bookmarkFolderId, bookmarkId) {

  const tree = await browser.bookmarks.getSubTree(bookmarkFolderId)
  return searchBookmarksTreeForId(tree[0].children, bookmarkId)
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

  async updateFavicon({ id, url }) {

    const precachedIconPath = this.precachedIcons.getIconPathFromUrl(url)
    const faviconUrl = precachedIconPath || await fetchFaviconUrl(url, true, { fetch, DOMParser })
    const faviconContent = await getFavicon(faviconUrl, { fetch })

    await browser.storage.local.set({
      [`favicon_content_${id}`]: faviconContent,
    })
  }

  async handleUpdatedBookmark(bookmarkId) {

    if (!isBookmarkInFolder(this.bookmarkFolderId, bookmarkId)) {
      return
    }

    const [bookmark] = await browser.bookmarks.get(bookmarkId)
    this.updateFavicon(bookmark)
  }

  async handleUpdatedBookmarkFolder() {

    const tree = await browser.bookmarks.getSubTree(this.bookmarkFolderId)
    const bookmarks = transformBookmarkTreeToBookmarkList(tree[0])

    await Promise.all(bookmarks.map((bookmark) => this.updateFavicon(bookmark)))
  }

  addListeners() {

    const listener = this.handleUpdatedBookmark.bind(this)
    browser.bookmarks.onCreated.addListener(listener)
    browser.bookmarks.onMoved.addListener(listener)

    browser.storage.onChanged.addListener((param) => {

      if ('bookmarkFolderId' in param) {
        this.handleUpdatedBookmarkFolder({
          bookmarkFolder: param.bookmarkFolderId.newValue,
        })
      }
    })
  }

  async init() {

    this.precachedIcons = new PrecachedIcons()
    await this.precachedIcons.init()

    this.bookmarkFolderId = await setBookmarkFolderIfNotExists()
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

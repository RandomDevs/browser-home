const { fetchFaviconUrl } = require('./fetchFaviconUrl')
const { getFavicon } = require('./downloadFavicon')

const STORE_VERSION = 1

async function shouldRefreshStore() {

  const store = await browser.storage.local.get('store_version')
  const version = store.store_version || 0

  if (version < STORE_VERSION) {

    await browser.storage.local.set({ store_version: STORE_VERSION })
    return true
  }

  return false
}

function getPrecachedIcon(url, { precachedDomainIcons }) {

  let domain = (new URL(url)).host

  if (domain.startsWith('www.')) {
    domain = domain.substring('www.'.length)
  }

  if (domain in precachedDomainIcons) {
    return precachedDomainIcons[domain]
  }

  return null
}

async function updateFavicon({ id, url }, { precachedDomainIcons }) {

  const precachedIcon = getPrecachedIcon(url, { precachedDomainIcons })
  const faviconUrl = precachedIcon ? `/precached-icons/${precachedIcon}` : await fetchFaviconUrl(url, true, { fetch, DOMParser })
  const faviconContent = await getFavicon(faviconUrl, { fetch })

  await browser.storage.local.set({
    [`favicon_content_${id}`]: faviconContent,
  })
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

async function isBookmarkInStartpageFolder(bookmarkFolderId, bookmarkId) {

  const tree = await browser.bookmarks.getSubTree(bookmarkFolderId)
  return searchBookmarksTreeForId(tree[0].children, bookmarkId)
}

async function handleUpdatedBookmark({ bookmarkFolderId, precachedDomainIcons }, bookmarkId) {

  if (!isBookmarkInStartpageFolder(bookmarkFolderId, bookmarkId)) {
    return
  }

  const [bookmark] = await browser.bookmarks.get(bookmarkId)
  updateFavicon(bookmark, { precachedDomainIcons })
}

async function handleUpdatedBookmarkFolder({ bookmarkFolderId, precachedDomainIcons }) {

  const tree = await browser.bookmarks.getSubTree(bookmarkFolderId)
  const bookmarks = transformBookmarkTreeToBookmarkList(tree[0])

  await Promise.all(bookmarks.map((bookmark) => updateFavicon(bookmark, { precachedDomainIcons })))
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

async function setDefaultBookmarkFolder() {

  const folderId = 'toolbar_____'
  await browser.storage.local.set({ bookmarkFolderId: folderId })

  return folderId
}

async function setBookmarkFolderIfNotExists() {

  const { bookmarkFolderId } = await browser.storage.local.get('bookmarkFolderId')

  if (!bookmarkFolderId) {
    return setDefaultBookmarkFolder()
  }

  // Check if bookmark folder still exists
  try {
    await browser.bookmarks.get(bookmarkFolderId)
  } catch (err) {
    return setDefaultBookmarkFolder()
  }

  return bookmarkFolderId
}

async function getPrecachedIcons() {

  try {

    const response = await fetch('/precached-icons/domains.json')
    const json = await response.json()
    return json

  } catch (error) {

    console.error('Got error while fetching precached icon store, returning empty')
    return {}
  }
}

async function init() {

  const precachedDomainIcons = await getPrecachedIcons()
  const bookmarkFolderId = await setBookmarkFolderIfNotExists()

  const listener = handleUpdatedBookmark.bind(null, { bookmarkFolderId, precachedDomainIcons })
  browser.bookmarks.onCreated.addListener(listener)
  browser.bookmarks.onMoved.addListener(listener)

  browser.storage.onChanged.addListener((param) => {

    if ('bookmarkFolderId' in param) {
      handleUpdatedBookmarkFolder({
        bookmarkFolder: param.bookmarkFolderId.newValue,
        precachedDomainIcons,
      })
    }
  })

  const refreshStore = await shouldRefreshStore()
  if (refreshStore) {
    console.log('Trigger new store refresh')
    handleUpdatedBookmarkFolder({ bookmarkFolderId, precachedDomainIcons })
  }

  console.log('Extension is loaded!!!')
}

init()

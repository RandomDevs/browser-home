/*
eslint-disable no-undef
*/

function buildFaviconUrl(baseUrl, faviconAttribute) {

  if (faviconAttribute.match(/^https?:\/\//) === null) {
    return baseUrl + faviconAttribute
  }

  return faviconAttribute
}

async function fetchFaviconUrl(url) {

  const parseUrl = (string, prop) => {
    const a = document.createElement('a')
    a.setAttribute('href', string)
    const { host, hostname, pathname, port, protocol, search, hash } = a
    const origin = `${protocol}//${hostname}${port.length ? `:${port}` : ''}`
    return prop ? eval(prop) : { origin, host, hostname, pathname, port, protocol, search, hash } // eslint-disable-line no-eval
  }

  const baseUrl = parseUrl(url).origin
  const response = await fetch(url, { mode: 'no-cors' })

  if (response.status !== 200) {
    console.error(`Grab favicon returned HTTP status ${response.status}`, response)
    return null
  }

  const html = await response.text()
  const parser = new DOMParser()
  const parsedDoc = parser.parseFromString(html, 'text/html')

  const appleTouchIconPrecomposed = parsedDoc.querySelector("link[rel='apple-touch-icon-precomposed']")
  const appleTouchIcon = parsedDoc.querySelector("link[rel='apple-touch-icon']")
  const shortcutIcon = parsedDoc.querySelector("link[rel='shortcut icon']")
  const icon = parsedDoc.querySelector("link[rel='icon']")

  const bestIcon = [
    appleTouchIconPrecomposed,
    appleTouchIcon,
    shortcutIcon,
    icon,
  ].find((icon) => icon)

  return buildFaviconUrl(baseUrl, bestIcon.getAttribute('href')) || null
}

async function updateFavicon({ id, url }) {

  const faviconUrl = await fetchFaviconUrl(url)
  await browser.storage.local.set({
    [`favicon_url_${id}`]: faviconUrl,
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

async function handleUpdatedBookmark(bookmarkFolderId, bookmarkId) {

  if (!isBookmarkInStartpageFolder(bookmarkFolderId, bookmarkId)) {
    return
  }

  const [bookmark] = await browser.bookmarks.get(bookmarkId)
  updateFavicon(bookmark)
}

async function createBookmarkFolder() {

  const folder = await browser.bookmarks.create({
    title: 'Favorites',
    type: 'folder',
  })

  await browser.storage.local.set({ bookmarkFolderId: folder.id })

  return folder.id
}

async function createBookmarkFolderIfNotExists() {

  const { bookmarkFolderId } = await browser.storage.local.get('bookmarkFolderId')

  if (!bookmarkFolderId) {
    return createBookmarkFolder()
  }

  // Check if bookmark folder still exists
  try {
    await browser.bookmarks.get(bookmarkFolderId)
  } catch (err) {
    return createBookmarkFolder()
  }

  return bookmarkFolderId
}

async function init() {

  const bookmarkFolderId = await createBookmarkFolderIfNotExists()
  const listener = handleUpdatedBookmark.bind(null, bookmarkFolderId)
  browser.bookmarks.onCreated.addListener(listener)
  browser.bookmarks.onMoved.addListener(listener)

  console.log('Extension is loaded')
}

init()

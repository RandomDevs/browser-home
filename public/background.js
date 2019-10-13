/*
eslint-disable no-undef
*/

function sortByQuality(a, b) {

  // Prioritize PNG over ICO
  if (a.extension === 'png' && b.extension !== 'png') {
    return -1
  }

  if (a.extension !== 'png' && b.extension === 'png') {
    return 1
  }

  // Sort by size
  return b.size - a.size
}

async function fetchFaviconUrl(url) {

  console.log('should fetch favicon from url', url)

  return null

  /*
  const response = await fetch(`http://grab-favicons.herokuapp.com/api/v1/grab-favicons?url=${url}`)

  if (response.status !== 200) {
    console.error(`Grab favicon returned HTTP status ${response.status}`)
    return null
  }

  const data = await response.json()
  if (data.length === 0) {
    return null
  }

  data.sort(sortByQuality)

  return data[0].url
  */
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
    title: 'Home',
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

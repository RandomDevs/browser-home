import { writable, get } from 'svelte/store'
import { findFolderInTree } from './utils/findFolderInTree'
import { getStore, getBookmarks } from './utils/browser'

export const allBookmarks = writable(null)
export const bookmarks = writable(null)

export function setCurrentFolderId(folderId) {

  if (folderId === null) {
    return
  }

  const ab = get(allBookmarks)

  if (folderId === ab.id) {
    bookmarks.set(ab)
    return
  }

  const { found, tree } = findFolderInTree(folderId, ab, ab, [])

  if (!found) {
    // @todo something wrong, show error message?
  }

  bookmarks.set(tree)
}

export async function setupStore() {

  const store = await getStore()
  await loadBookmarks(store)
  setCurrentFolderId(store.bookmarkFolderId)
}

export async function loadBookmarks(store) {

  const localBookmarks = await getBookmarks(store.bookmarkFolderId)
  const favicons = filterFaviconsFromStore(store)

  mapBookmarksTree(localBookmarks, (bookmark) => {

    if (bookmark.id in favicons) {
      return { ...bookmark, faviconUrl: favicons[bookmark.id] }
    }

    return bookmark
  })

  bookmarks.set(localBookmarks)
  allBookmarks.set(localBookmarks)
}

function mapBookmarksTree(folder, callback) {

  for (let index = 0; index < folder.children.length; index += 1) {

    const child = folder.children[index]

    if (child.type === 'bookmark') {
      folder.children[index] = callback(child) // eslint-disable-line no-param-reassign
    } else {
      mapBookmarksTree(child, callback)
    }
  }
}

function filterFaviconsFromStore(store) {

  return Object.keys(store).reduce((acc, key) => {

    if (!key.startsWith('favicon_url_')) {
      return acc
    }

    const bookmarkId = key.substr('favicon_url_'.length)

    return { ...acc, [bookmarkId]: store[key] }
  }, {})
}

import { writable, get } from 'svelte/store'
import { findFolderInTree } from './utils/findFolderInTree'

export const allBookmarks = writable(null)
export const bookmarks = writable(null)
export const favicons = writable({})

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

export function setFavicons(store) {

  const result = Object.keys(store).reduce((acc, key) => {

    if (!key.startsWith('favicon_url_')) {
      return acc
    }

    const bookmarkId = key.substr('favicon_url_'.length)

    return { ...acc, [bookmarkId]: store[key] }
  }, {})

  favicons.set(result)
}

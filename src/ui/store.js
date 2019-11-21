import { writable, get } from 'svelte/store'
import { findFolderInTree } from './utils/findFolderInTree'
import { storage, getBookmarks, onBookmarkUpdate, onStoreUpdate } from './utils/browser'
import { IconStore } from '../lib/IconStore'

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

export async function getCurrentFolderId() {

  const { bookmarkFolderId } = await storage().get('bookmarkFolderId')
  return bookmarkFolderId
}

export async function setupStore() {

  const bookmarkFolderId = await getCurrentFolderId()
  const iconStore = new IconStore(bookmarkFolderId, storage())
  const updateBookmarks = () => loadBookmarks(bookmarkFolderId, iconStore)

  await updateBookmarks()
  setCurrentFolderId(bookmarkFolderId)

  onBookmarkUpdate(() => updateBookmarks())
  onStoreUpdate(() => updateBookmarks())
}

export async function loadBookmarks(bookmarkFolderId, iconStore) {

  const localBookmarks = await getBookmarks(bookmarkFolderId)
  const icons = await iconStore.getAll()

  mapBookmarksTree(localBookmarks, (bookmark) => {

    if (bookmark.id in icons) {
      return { ...bookmark, iconUrl: icons[bookmark.id] }
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


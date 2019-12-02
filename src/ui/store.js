import { writable, get } from 'svelte/store'
import { storage, getBookmarks, onBookmarkUpdate, onStoreUpdate } from './utils/browser'
import { IconStore } from '../lib/IconStore'
import { mapTree, findFolderInTree } from '../lib/bookmarkHelpers'

export const allBookmarks = writable(null)
export const bookmarks = writable(null)

const history = []

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
    console.error('Could not find bookmark in tree')
    return
  }

  bookmarks.set(tree)
}

function transformBookmarks(bookmarkTree, multiLevelRootFolder) {

  const hasBookmarksInRootFolder = bookmarkTree.children.some(child => child.type === 'bookmark')
  let { children } = bookmarkTree

  if (multiLevelRootFolder && hasBookmarksInRootFolder) {

    const favoritesFolder = {
      id: '___favorites',
      type: 'folder',
      title: 'Favorites',
      children: [],
    }

    children = bookmarkTree.children.reduce((acc, child, index) => {

      if (index === 0) {
        acc.push(favoritesFolder)
      }

      if (child.type === 'bookmark') {
        favoritesFolder.children.push(child)
      } else {
        acc.push(child)
      }

      return acc
    }, [])
  }

  return Object.assign(bookmarkTree, { isRoot: true, children })
}

export async function setupStore() {

  const { bookmarkFolderId, multiLevelRootFolder } = await storage().get(['bookmarkFolderId', 'multiLevelRootFolder'])
  const iconStore = new IconStore(bookmarkFolderId, storage())
  const updateBookmarks = () => loadBookmarks(bookmarkFolderId, iconStore, multiLevelRootFolder)

  await updateBookmarks()
  setCurrentFolderId(bookmarkFolderId)

  onBookmarkUpdate(() => updateBookmarks())
  onStoreUpdate(() => updateBookmarks())
}

export async function loadBookmarks(bookmarkFolderId, iconStore, multiLevelRootFolder) {

  const localBookmarks = transformBookmarks(await getBookmarks(bookmarkFolderId), multiLevelRootFolder)
  const icons = await iconStore.getAll()

  mapTree(localBookmarks, (bookmark) => {

    if (bookmark.id in icons) {
      return { ...bookmark, iconUrl: icons[bookmark.id] }
    }

    return bookmark
  })

  bookmarks.set(localBookmarks)
  allBookmarks.set(localBookmarks)
}

export function pushHistory(folderId) {
  history.push(folderId)
}

export function popHistory() {

  if (!hasHistory()) {
    return null
  }

  return history.pop()
}

export function hasHistory() {
  return history.length > 0
}

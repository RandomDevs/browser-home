import * as mockedData from './mockedData'

function isBrowser() {
  return typeof browser !== 'undefined'
}

function transformBookmarks(bookmarks) {
  return Object.assign(bookmarks, { isRoot: true, title: 'Favorites' })
}

export function onBookmarkUpdate(listener) {

  if (!isBrowser()) {
    return
  }

  browser.bookmarks.onCreated.addListener(listener)
  browser.bookmarks.onMoved.addListener(listener)
  browser.bookmarks.onRemoved.addListener(listener)
}

export function onStoreUpdate(listener) {

  if (!isBrowser()) {
    return
  }

  browser.storage.onChanged.addListener(listener)
}

export async function getBookmarks(bookmarkFolderId) {

  if (isBrowser()) {
    const tree = await browser.bookmarks.getSubTree(bookmarkFolderId)
    return transformBookmarks(tree[0])
  }

  return transformBookmarks(mockedData.bookmarks[0])
}

function filterFolders(tree) {

  const children = tree.children
    .filter((child) => child.type === 'folder')
    .map((child) => filterFolders(child))

  return { ...tree, children }
}

export async function getAllBookmarkFolders() {

  if (isBrowser()) {
    const tree = await browser.bookmarks.getTree()
    return filterFolders(tree[0])
  }

  return filterFolders(mockedData.rootBookmarks[0])
}

export function storage() {

  if (isBrowser()) {
    return browser.storage.local
  }

  return {
    get: () => mockedData.store,
  }
}

export async function setBookmarkFolderId(folderId) {

  if (!isBrowser()) {
    return
  }

  await browser.storage.local.set({ bookmarkFolderId: folderId })
}

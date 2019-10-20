import * as mockedData from './mockedData'

/* global browser */

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

export async function getStore() {

  if (isBrowser()) {
    return browser.storage.local.get()
  }

  return mockedData.store
}

import * as mockedData from './mockedData'

function isBrowser() {
  return typeof browser !== 'undefined'
}

function transformBookmarks(bookmarks) {
  return Object.assign(bookmarks, { isRoot: true })
}

export async function getBookmarks(bookmarkFolderId) {

  if (isBrowser()) {
    const tree = await browser.bookmarks.getSubTree(bookmarkFolderId) // eslint-disable-line no-undef
    return transformBookmarks(tree[0])
  }

  return transformBookmarks(mockedData.bookmarks[0])
}

export async function getStore() {

  if (isBrowser()) {
    return browser.storage.local.get() // eslint-disable-line no-undef
  }

  return mockedData.store
}

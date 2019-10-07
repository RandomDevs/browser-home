import { bookmarks, store } from './mockedData'

function isBrowser() {
  return typeof browser !== 'undefined'
}

export async function getBookmarks(bookmarkFolderId) {

  if (isBrowser()) {
    const tree = await browser.bookmarks.getSubTree(bookmarkFolderId) // eslint-disable-line no-undef
    return tree[0]
  }

  return bookmarks[0]
}

export async function getStore() {

  if (isBrowser()) {
    return browser.storage.local.get() // eslint-disable-line no-undef
  }

  return store
}

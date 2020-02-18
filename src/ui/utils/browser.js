export function onBookmarkUpdate(listener) {
  browser.bookmarks.onCreated.addListener(listener)
  browser.bookmarks.onMoved.addListener(listener)
  browser.bookmarks.onRemoved.addListener(listener)
}

export function onStoreUpdate(listener) {
  browser.storage.onChanged.addListener(listener)
}

export async function getBookmarks(bookmarkFolderId) {

  const tree = await browser.bookmarks.getSubTree(bookmarkFolderId)
  return transformTree(tree[0])
}

function transformTree(tree) {

  if (typeof tree.children === 'undefined') {
    return { ...tree, type: 'bookmark' }
  }

  return {
    ...tree,
    type: 'folder',
    children: tree.children.map(child => transformTree(child)),
  }
}

function filterFolders(tree) {

  const children = tree.children
    .filter((child) => child.type === 'folder')
    .map((child) => filterFolders(child))

  return { ...tree, children }
}

export async function getAllBookmarkFolders() {

  const tree = await browser.bookmarks.getTree()
  return filterFolders(tree[0])
}

export function storage() {
  return browser.storage.local
}

export async function getStoreValue(key) {
  const obj = await storage().get(key)
  return obj[key]
}

export function setStoreValue(key, value) {
  return storage().set({ [key]: value })
}

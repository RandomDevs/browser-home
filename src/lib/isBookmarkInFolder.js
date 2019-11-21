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

async function isBookmarkInFolder(bookmarkFolderId, bookmarkId) {

  const tree = await browser.bookmarks.getSubTree(bookmarkFolderId)
  return searchBookmarksTreeForId(tree[0].children, bookmarkId)
}

module.exports = {
  isBookmarkInFolder,
}

const { getBookmarkType, TYPE_BOOKMARK, TYPE_FOLDER } = require('./bookmarkHelpers')

function searchBookmarksTreeForId(tree, bookmarkId) {

  for (const bookmark of tree) {

    let searchResult
    const type = getBookmarkType(bookmark)

    if (type === TYPE_FOLDER) {
      searchResult = searchBookmarksTreeForId(bookmark.children, bookmarkId)
    } else if (type === TYPE_BOOKMARK) {
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

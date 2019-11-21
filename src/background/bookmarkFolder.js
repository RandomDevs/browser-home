const { defaultBookmarkFolderId } = require('./config')

async function setBookmarkFolderIfNotExists() {

  const { bookmarkFolderId } = await browser.storage.local.get('bookmarkFolderId')

  if (!bookmarkFolderId) {
    return setDefaultBookmarkFolder()
  }

  // Check if bookmark folder still exists
  try {
    await browser.bookmarks.get(bookmarkFolderId)
  } catch (err) {
    return setDefaultBookmarkFolder()
  }

  return bookmarkFolderId
}

async function setDefaultBookmarkFolder() {

  await browser.storage.local.set({ bookmarkFolderId: defaultBookmarkFolderId })
  return defaultBookmarkFolderId
}

module.exports = {
  setBookmarkFolderIfNotExists,
  setDefaultBookmarkFolder,
}

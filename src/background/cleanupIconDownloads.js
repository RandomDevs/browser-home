const { isBookmarkInFolder } = require('./isBookmarkInFolder')

async function getRemovableKeys(bookmarkFolderId, store) {

  const removableKeys = await Promise.all(
    Object.keys(store).map(async key => {

      if (!key.startsWith('favicon_content_')) {
        return undefined
      }

      const bookmarkId = key.substring('favicon_content_'.length)
      const keep = await isBookmarkInFolder(bookmarkFolderId, bookmarkId)

      return keep ? undefined : key
    }),
  )

  return removableKeys.filter(key => key !== undefined)
}

async function cleanupIconDownloads(bookmarkFolderId) {

  console.log('Cleaning up icon downloads that are not used any more')

  const store = await browser.storage.local.get()
  const removableKeys = await getRemovableKeys(bookmarkFolderId, store)

  console.log(`Got ${removableKeys.length} icons to delete`)

  if (removableKeys.length > 0) {
    await browser.storage.local.remove(removableKeys)
  }

  console.log('Done cleaning up')
}

module.exports = {
  cleanupIconDownloads,
}

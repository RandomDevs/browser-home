
const { isBookmarkInFolder } = require('./isBookmarkInFolder')

const STORE_PREFIX = 'icon_content_'

function bookmarkIdsFromStore(store) {

  return Object.keys(store)
    .filter(key => key.startsWith(STORE_PREFIX))
    .map(key => key.substring(STORE_PREFIX.length))
}

class IconStore {

  constructor(bookmarkFolderId, storage) {
    this.bookmarkFolderId = bookmarkFolderId
    this.storage = storage
  }

  async store(bookmarkId, data) {

    await this.storage.set({
      [STORE_PREFIX + bookmarkId]: data,
    })
  }

  async getAll() {

    const store = await this.storage.get()
    const bookmarkIds = bookmarkIdsFromStore(store)

    return bookmarkIds.reduce((acc, bookmarkId) => ({ ...acc, [bookmarkId]: store[STORE_PREFIX + bookmarkId] }), {})
  }

  async cleanup() {

    console.log('Cleaning up icon downloads that are not used any more')

    const removableKeys = await this.getRemovableKeys(this.bookmarkFolderId)

    console.log(`Got ${removableKeys.length} icons to delete`)

    if (removableKeys.length > 0) {
      await this.storage.remove(removableKeys)
    }

    console.log('Done cleaning up')
  }

  async getRemovableKeys(bookmarkFolderId) {

    const store = await this.storage.get()

    const removableKeys = await Promise.all(
      bookmarkIdsFromStore(store).map(async bookmarkId => {

        const keep = await isBookmarkInFolder(bookmarkFolderId, bookmarkId)
        return keep ? undefined : STORE_PREFIX + bookmarkId
      }),
    )

    return removableKeys.filter(key => key !== undefined)
  }
}

module.exports = {
  IconStore,
}

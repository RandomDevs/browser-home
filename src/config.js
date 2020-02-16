const { identifyBrowser, TYPE_CHROME } = require('./lib/identifyBrowser')

function getDefaultBookmarkFolderId() {

  if (identifyBrowser() === TYPE_CHROME) {
    return '1'
  }

  return 'toolbar_____'
}

module.exports = {
  storeVersion: 2,
  defaultStore: {
    bookmarkFolderId: getDefaultBookmarkFolderId(),
    multiLevelRootFolder: false,
  },
}

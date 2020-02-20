const { identifyBrowser, TYPE_CHROME, TYPE_EDGE } = require('./lib/identifyBrowser')

function getDefaultBookmarkFolderId() {

  if ([TYPE_CHROME, TYPE_EDGE].includes(identifyBrowser())) {
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

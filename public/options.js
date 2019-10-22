// Save changes when changing home folder <select>
document.getElementById('folder-select').addEventListener('change', (event) => {
  browser.storage.local.set({ bookmarkFolderId: event.target.value })
})

async function getBookmarkFolderId() {
  const { bookmarkFolderId } = await browser.storage.local.get('bookmarkFolderId')
  return bookmarkFolderId
}

async function initHomeFolderSelect() {
  const bookmarkFolderId = await getBookmarkFolderId()
  const selectElement = document.getElementById('folder-select')

  function makeIndent(indentLength) {
    return '     '.repeat(indentLength)
  }

  function buildItems(bookmarkItem, indent) {
    let bookmarkIndent = indent

    if (bookmarkItem.type === 'folder') {
      const option = document.createElement('option')
      option.text = makeIndent(bookmarkIndent) + '📁 ' + bookmarkItem.title
      option.value = bookmarkItem.id
      option.selected = (bookmarkFolderId === bookmarkItem.id)
      selectElement.add(option)
      bookmarkIndent += 1
    }

    if (bookmarkItem.children) {
      bookmarkItem.children.forEach(child => {
        buildItems(child, bookmarkIndent)
      })
    }
  }

  function buildTree(bookmarkItems) {
    buildItems(bookmarkItems[0], 0)
  }

  browser.bookmarks.getTree().then(buildTree)
}

initHomeFolderSelect()


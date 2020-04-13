
const TYPE_FOLDER = 'folder'
const TYPE_BOOKMARK = 'bookmark'
const TYPE_SEPARATOR = 'separator'

function getBookmarkType(bookmark) {

  if (bookmark.type) {
    return bookmark.type
  }

  if (bookmark.url) {
    return TYPE_BOOKMARK
  }

  if (bookmark.children) {
    return TYPE_FOLDER
  }

  return null
}

function mapTree(folder, callback) {

  for (let index = 0; index < folder.children.length; index += 1) {

    const child = folder.children[index]
    const type = getBookmarkType(child)

    if (type === TYPE_BOOKMARK) {
      folder.children[index] = callback(child) // eslint-disable-line no-param-reassign
    } else if (type === TYPE_FOLDER) {
      mapTree(child, callback)
    }
  }
}

function removeSeparators(folder) {

  const children = []

  for (let index = 0; index < folder.children.length; index += 1) {

    const child = folder.children[index]
    const type = getBookmarkType(child)

    if (type !== TYPE_SEPARATOR) {
      children.push(child)
    }

    if (type === TYPE_FOLDER) {
      removeSeparators(child)
    }
  }

  folder.children = children // eslint-disable-line no-param-reassign
}

function flatternTree(folder) {

  if (folder.children.length > 0) {

    return folder.children.reduce((acc, child) => {

      const type = getBookmarkType(child)
      if (type === TYPE_FOLDER) {
        return [...acc, ...flatternTree(child)]
      }

      return [...acc, child]
    }, [])
  }

  return []
}

function findFolderInTree(folderId, tree, rootTree, path) {

  path.push({
    id: tree.id === rootTree.id ? null : tree.id,
    title: tree.title,
  })

  for (const bookmark of tree.children) {

    if (bookmark.id === folderId) {
      return {
        found: true,
        path,
        tree: bookmark,
      }
    }

    const type = getBookmarkType(bookmark)

    if (type === TYPE_FOLDER) {
      const response = findFolderInTree(folderId, bookmark, rootTree, path)
      if (response.found) {
        return response
      }
    }
  }

  return {
    found: false,
  }
}

module.exports = {
  getBookmarkType,
  mapTree,
  removeSeparators,
  flatternTree,
  findFolderInTree,
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_SEPARATOR,
}

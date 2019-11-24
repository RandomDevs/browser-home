
const TYPE_FOLDER = 'folder'
const TYPE_BOOKMARK = 'bookmark'

function mapTree(folder, callback) {

  for (let index = 0; index < folder.children.length; index += 1) {

    const child = folder.children[index]

    if (child.type === TYPE_BOOKMARK) {
      folder.children[index] = callback(child) // eslint-disable-line no-param-reassign
    } else {
      mapTree(child, callback)
    }
  }
}

function flatternTree(folder) {

  if (folder.children.length > 0) {

    return folder.children.reduce((acc, child) => {

      if (child.type === TYPE_FOLDER) {
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

    if (bookmark.type === TYPE_FOLDER) {
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
  mapTree,
  flatternTree,
  findFolderInTree,
}


export function findFolderInTree(folderId, tree, rootTree, path) {

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

    if (bookmark.type === 'folder') {
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

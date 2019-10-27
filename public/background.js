(function () {
  'use strict';

  const MINIMUM_ICON_SIZE = 50 * 50;

  async function getRealFaviconSize(url) {

    try {
      const size = await new Promise((resolve, reject) => {

        const image = new Image();
        image.onload = () => resolve(image.width * image.height);
        image.onerror = () => reject(new Error(`Something went wrong when downloading favicon ${url}`));
        image.src = url;
      });

      return size
    } catch (err) {
      console.error(err);
    }

    return null
  }

  function calculateTotalSize(sizes) {

    if (!sizes) {
      return null
    }

    const [width, height] = sizes.split('x');
    return parseInt(width, 10) * parseInt(height, 10)
  }

  function getLargestIconFromList(list) {

    return Array.from(list).reduce((largestIcon, icon) => {

      const size = calculateTotalSize(icon.getAttribute('sizes'));

      if (largestIcon === null || size > largestIcon.size) {
        return { href: icon.getAttribute('href'), size }
      }

      return largestIcon
    }, null)
  }

  async function fetchFaviconUrl(url) {

    const response = await fetch(url, { mode: 'no-cors' });

    if (response.status !== 200) {
      console.error(`Grab favicon returned HTTP status ${response.status}`, response);
      return null
    }

    const html = await response.text();
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, 'text/html');

    const appleTouchIconPrecomposed = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='apple-touch-icon-precomposed']"));
    const appleTouchIcon = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='apple-touch-icon']"));
    const shortcutIcon = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='shortcut icon']"));
    const icon = getLargestIconFromList(parsedDoc.querySelectorAll("link[rel='icon']"));

    const availableIcons = [appleTouchIconPrecomposed, appleTouchIcon, shortcutIcon, icon]
      .filter((currentIcon) => currentIcon !== null)
      .map((currentIcon) => (new URL(currentIcon.href, url)).href);

    if (availableIcons.length === 0) {
      return null
    }

    const availableIconSizes = await Promise.all(availableIcons.map((iconHref) => getRealFaviconSize(iconHref)));

    const iconsBySize = availableIcons
      .map((href, index) => ({ href, size: availableIconSizes[index] }))
      .filter(({ size }) => size > MINIMUM_ICON_SIZE)
      .sort((a, b) => b.size - a.size);

    if (iconsBySize.length === 0) {
      return null
    }

    return iconsBySize[0].href
  }

  async function updateFavicon({ id, url }) {

    const faviconUrl = await fetchFaviconUrl(url);
    await browser.storage.local.set({
      [`favicon_url_${id}`]: faviconUrl,
    });
  }

  function searchBookmarksTreeForId(tree, bookmarkId) {

    for (const bookmark of tree) {

      let searchResult;

      if (bookmark.type === 'folder') {
        searchResult = searchBookmarksTreeForId(bookmark.children, bookmarkId);
      } else {
        searchResult = bookmark.id === bookmarkId;
      }

      if (searchResult === true) {
        return true
      }
    }

    return false
  }

  async function isBookmarkInStartpageFolder(bookmarkFolderId, bookmarkId) {

    const tree = await browser.bookmarks.getSubTree(bookmarkFolderId);
    return searchBookmarksTreeForId(tree[0].children, bookmarkId)
  }

  async function handleUpdatedBookmark(bookmarkFolderId, bookmarkId) {

    if (!isBookmarkInStartpageFolder(bookmarkFolderId, bookmarkId)) {
      return
    }

    const [bookmark] = await browser.bookmarks.get(bookmarkId);
    updateFavicon(bookmark);
  }

  async function handleUpdatedBookmarkFolder(bookmarkFolderId) {

    const tree = await browser.bookmarks.getSubTree(bookmarkFolderId);
    const bookmarks = transformBookmarkTreeToBookmarkList(tree[0]);

    await Promise.all(bookmarks.map((bookmark) => updateFavicon(bookmark)));
  }

  function transformBookmarkTreeToBookmarkList(folder) {

    if (folder.children.length > 0) {

      return folder.children.reduce((acc, child) => {

        if (child.type === 'folder') {
          return [...acc, ...transformBookmarkTreeToBookmarkList(child)]
        }

        return [...acc, child]
      }, [])
    }

    return []
  }

  async function createBookmarkFolder() {

    const folder = await browser.bookmarks.create({
      title: 'Favorites',
      type: 'folder',
    });

    await browser.storage.local.set({ bookmarkFolderId: folder.id });

    return folder.id
  }

  async function createBookmarkFolderIfNotExists() {

    const { bookmarkFolderId } = await browser.storage.local.get('bookmarkFolderId');

    if (!bookmarkFolderId) {
      return createBookmarkFolder()
    }

    // Check if bookmark folder still exists
    try {
      await browser.bookmarks.get(bookmarkFolderId);
    } catch (err) {
      return createBookmarkFolder()
    }

    return bookmarkFolderId
  }

  async function init() {

    const bookmarkFolderId = await createBookmarkFolderIfNotExists();
    const listener = handleUpdatedBookmark.bind(null, bookmarkFolderId);
    browser.bookmarks.onCreated.addListener(listener);
    browser.bookmarks.onMoved.addListener(listener);

    browser.storage.onChanged.addListener((param) => {

      if ('bookmarkFolderId' in param) {
        handleUpdatedBookmarkFolder(param.bookmarkFolderId.newValue);
      }
    });

    console.log('Extension is loaded');
  }

  init();

}());
//# sourceMappingURL=background.js.map

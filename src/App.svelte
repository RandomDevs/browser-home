<script>
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { getStore, getBookmarks } from './utils/browser'
  import { findFolderInTree } from './utils/findFolderInTree'

  let allBookmarks = null
  let bookmarks = null

  function setCurrentFolderId(folderId) {

    if (folderId === allBookmarks.id) {
      bookmarks = allBookmarks
      return
    }

    const { found, tree } = findFolderInTree(folderId, allBookmarks, allBookmarks, [])

    if (!found) {
      // @todo something wrong, show error message?
    }

    bookmarks = tree
  }

  function onBookmarkClick(event, bookmark) {

    event.preventDefault()

    if (bookmark.type === 'folder') {
      return setCurrentFolderId(bookmark.id)
    }

    window.location = bookmark.url
  }

  function getFolderName(bookmark) {

    if (bookmark.parentId) {
      return bookmark.title
    }

    return 'Webstart'
  }

  onMount(async () => {

    const store = await getStore()
    allBookmarks = await getBookmarks(store.bookmarkFolderId)
    setCurrentFolderId(store.bookmarkFolderId)
  })

</script>

<style>
  body {
    background: #F9F9FA;
  }

  .bookmarks-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    grid-auto-rows: minmax(100px, auto);
  }

  .bookmarks-item {
    text-align: center;
  }

  .bookmarks-item:hover .bookmarks-item-icon {
    box-shadow: 0 0 0 5px #ddd;
  }

  .bookmarks-item-icon {
    border-radius: 5px;
    background: #ccc;
    box-shadow: 0 1px 4px 0 rgba(12, 12, 13, 0.1);
    width: 100px;
    height: 100px;
    display: inline-block;
  }

  .bookmarks-item-name {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    color: #333;
  }
</style>

{#if bookmarks !== null}
  <h1>{getFolderName(bookmarks)}</h1>
  <div class="bookmarks-container">
    {#each bookmarks.children as bookmark}
      <div class="bookmarks-item" on:click={event => onBookmarkClick(event, bookmark)}>
        <div class="bookmarks-item-icon">
          {#if bookmark.type === 'folder'}
            folder
          {:else}
            bookmark
          {/if}
        </div>
        <div class="bookmarks-item-name">{bookmark.title}</div>
      </div>
    {/each}
  </div>
{/if}

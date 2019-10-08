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

  :root {
    --main-bg-color: #f9f9fa;
    --main-text-color: #0C0C0D;

    --main-max-width: 1042px;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --main-bg-color: #2a2a2e;
      --main-text-color: #f9f9fa;
    }
  }

  :global(body) {
    background: var(--main-bg-color);
    color: var(--main-text-color);
  }

  .header {
    max-width: var(--main-max-width);
    margin: 3rem auto 2rem;
    font-size: 1.2rem;
  }

  .bookmarks-container {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat( auto-fill, minmax(100px, 1fr) );
    grid-auto-rows: minmax(100px, auto);
    max-width: var(--main-max-width);
    margin: 3rem auto 2rem auto;
  }

  .bookmarks-item {
    text-align: center;
    cursor: pointer;
  }

  .bookmarks-item-icon {
    border-radius: 4px;
    background: #ccc;
    box-shadow: 0 1px 4px 0 rgba(12, 12, 13, 0.1);
    width: 100px;
    height: 100px;
    display: inline-block;
  }

  .bookmarks-item-name {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>

{#if bookmarks !== null}

  <div class="header">{getFolderName(bookmarks)}</div>

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


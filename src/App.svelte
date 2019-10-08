<script>
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { getStore, getBookmarks } from './utils/browser'
  import { findFolderInTree } from './utils/findFolderInTree'
  import { setCurrentFolderId, bookmarks, allBookmarks } from './store'
  import BackButton from './BackButton.svelte'

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
    $allBookmarks = await getBookmarks(store.bookmarkFolderId)
    setCurrentFolderId(store.bookmarkFolderId)
  })

</script>

<style>

  :root {
    --main-bg-color: #f9f9fa;
    --main-text-color: #0C0C0D;
    --tile-bg-color: rgb(255, 255, 255);

    --main-max-width: 1042px;
    --tile-size: 96px;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --main-bg-color: #2a2a2e;
      --main-text-color: #f9f9fa;
      --tile-bg-color: rgb(56, 56, 61);
    }
  }

  :global(body) {
    background: var(--main-bg-color);
    color: var(--main-text-color);
  }

  .top-bar {
    max-width: var(--main-max-width);
    min-height: 32px;
    margin: 3rem auto 1.5rem;
    font-size: 1.15rem;
    display: flex;
    align-items: center;
  }

  .bookmarks-container {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat( auto-fill, minmax(100px, 1fr) );
    grid-auto-rows: minmax(100px, auto);
    max-width: var(--main-max-width);
    margin: 1rem auto 1rem auto;
  }

  .bookmarks-item {
    cursor: pointer;
    width: var(--tile-size);
  }

  .bookmarks-item-tile {
    border-radius: 4px;
    background: var(--tile-bg-color);
    box-shadow: 0 1px 4px 0 rgba(12, 12, 13, 0.1);
    width: var(--tile-size);
    height: var(--tile-size);
    display: inline-block;
  }
  .bookmarks-item-tile-folder {
    background-image: url("/icon-folder.svg");
    background-position: center;
    background-repeat: no-repeat;
  }

  .bookmarks-item-name {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    width: var(--tile-size);
  }
</style>

{#if $bookmarks !== null}

  <div class="top-bar">
    <BackButton />
    {getFolderName($bookmarks)}
  </div>

  <div class="bookmarks-container">
    {#each $bookmarks.children as bookmark}
      <div class="bookmarks-item" on:click={event => onBookmarkClick(event, bookmark)}>
        {#if bookmark.type === 'folder'}
          <div class="bookmarks-item-tile bookmarks-item-tile-folder"></div>
        {:else}
          <div class="bookmarks-item-tile"></div>
        {/if}
        <div class="bookmarks-item-name">{bookmark.title}</div>
      </div>
    {/each}
  </div>
{/if}


<script>
  import { fade } from 'svelte/transition'
  import { getStore, getBookmarks } from './utils/browser'
  import { findFolderInTree } from './utils/findFolderInTree'
  import { setCurrentFolderId, bookmarks } from './store'
  import BackButton from './BackButton.svelte'

  function onBookmarkFolderClick(event, bookmark) {
    event.preventDefault()
    return setCurrentFolderId(bookmark.id)
  }
</script>

<style>
  :root {
    --main-bg-color: #f9f9fa;
    --main-text-color: #0C0C0D;
    --tile-bg-color: rgb(255, 255, 255);
    --top-bar-color: rgb(115, 115, 115);

    --main-max-width: 1042px;
    --tile-size: 96px;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --main-bg-color: #2a2a2e;
      --main-text-color: #f9f9fa;
      --tile-bg-color: rgb(56, 56, 61);
      --top-bar-color: rgb(207, 207, 209);
    }
  }

  :global(body) {
    background: var(--main-bg-color);
    color: var(--main-text-color);
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Ubuntu", "Helvetica Neue", sans-serif;
    -moz-osx-font-smoothing: grayscale;
  }

  a, a:hover {
    color: var(--main-text-color);
    text-decoration: none;
  }

  .top-bar {
    color: var(--top-bar-color);
    max-width: var(--main-max-width);
    min-height: 32px;
    margin: 3rem auto 1.5rem;
    font-size: 1.15rem;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1rem;
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
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .bookmarks-item-tile-folder {
    background-image: url("/icon-folder.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 35%;
  }
  .bookmarks-item-tile-no-favicon {
    font-size: 3rem;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
  .bookmarks-item-tile-letter {
    color: #aaa;
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
  .bookmarks-empty-state {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.04);
    border-radius: 10px;
    max-width: var(--main-max-width);
    margin: 1rem auto 1rem auto;
  }
  .bookmarks-empty-state a {
    color: teal;
    text-decoration: underline;
  }
  .bookmarks-empty-state > div {
    padding: 3rem;
  }
</style>


{#if $bookmarks !== null}

  <div class="top-bar">
    <BackButton />
    {$bookmarks.title}
  </div>

  {#if $bookmarks.children.length === 0}

    <div class="bookmarks-empty-state">
      <div>
        <h3>No bookmarks here 😭</h3>
        <p>You have no bookmarks in your selected folder ({$bookmarks.title})</p>
        <p>Change your home folder in the <a href="#" on:click={() => openOptionsPage()}>extention preferences</a></p>
      </div>
    </div>

  {:else}

    <div class="bookmarks-container">

      {#each $bookmarks.children as bookmark}

        {#if bookmark.type === 'folder'}

          <div class="bookmarks-item" on:click={event => onBookmarkFolderClick(event, bookmark)}>
            <div class="bookmarks-item-tile bookmarks-item-tile-folder"></div>
            <div class="bookmarks-item-name">{bookmark.title}</div>
          </div>

        {:else if bookmark.type === 'bookmark'}

          <a href="{bookmark.url}" class="bookmarks-item" out:fade={{ duration: 100 }}>
            {#if bookmark.faviconUrl}
              <div class="bookmarks-item-tile" style="background-image:url('{bookmark.faviconUrl}'"></div>
            {:else}
              <div class="bookmarks-item-tile bookmarks-item-tile-no-favicon">
                <div class="bookmarks-item-tile-letter">{bookmark.title.charAt(0).toUpperCase()}</div>
              </div>
            {/if}
            <div class="bookmarks-item-name">{bookmark.title}</div>
          </a>

        {/if}

      {/each}
    </div>

  {/if}

{/if}


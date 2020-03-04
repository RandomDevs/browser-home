<script>
  import { beforeUpdate } from 'svelte'
  import { setCurrentFolderId, pushHistory, hasHistory } from './store'
  import BackButton from './BackButton.svelte'
  import FolderTile from './FolderTile.svelte'
  import BookmarkTile from './BookmarkTile.svelte'

  export let folder = null
  export let currentFolderId = folder.id
  export let title

  function openOptionsPage() {
    event.preventDefault()
    browser.runtime.openOptionsPage()
  }

  function onFolderClick(event, bookmark) {

    event.preventDefault()
    pushHistory(currentFolderId)
    setCurrentFolderId(bookmark.id)
  }

  let folderHasHistory = false
  beforeUpdate(() => {
    folderHasHistory = hasHistory()
  })
</script>

<style>
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

<div class="top-bar">
  {#if folderHasHistory}
    <BackButton />
  {/if}
  {title ? title : folder.title}
</div>

{#if folder.children.length === 0}

  <div class="bookmarks-empty-state">
    <div>
      <h3>No bookmarks here 😭</h3>
      <p>You have no bookmarks in your selected folder ({folder.title})</p>
      <p>Change your home folder in the <a href="#" on:click={() => openOptionsPage()}>extension preferences</a></p>
    </div>
  </div>

{:else}

  <div class="bookmarks-container">

    {#each folder.children as bookmark}

      {#if bookmark.type === 'folder'}

        {#if bookmark.children.length === 0}
          <FolderTile name={bookmark.title} isEmptyFolder={true}/>
        {:else}
          <div on:click={event => onFolderClick(event, bookmark)}>
            <FolderTile name={bookmark.title} />
          </div>
        {/if}

      {:else if bookmark.type === 'bookmark'}

        <BookmarkTile bookmark={bookmark} />

      {/if}

    {/each}

  </div>

{/if}

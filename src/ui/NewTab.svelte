<script>
  import { onMount } from 'svelte'
  import { setCurrentFolderId, bookmarks } from './store'
  import Folder from './Folder.svelte'
  import BackButton from './BackButton.svelte'
  import { getStoreValue } from './utils/browser'

  let multiLevelRootFolder

  onMount(async () => {
    multiLevelRootFolder = await getStoreValue('multiLevelRootFolder')
  })

  function openOptionsPage() {
    browser.runtime.openOptionsPage()
  }
</script>

<style>
  :global(body) {
    color: var(--main-text-color);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Ubuntu", "Helvetica Neue", sans-serif;
    -moz-osx-font-smoothing: grayscale;
  }

  .main-page {
    position: relative;
    background-color: var(--main-bg-color);
    padding: 2rem;
    min-height: 100vh;
  }

  .options-page-link {
    position: absolute;
    right: 24px;
    bottom: 20px;
    width: 26px;
    height: 26px;
    background-image: var(--bg-cog-icon);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 20px 20px;
    border-radius: 100%;
    cursor: pointer;
    opacity: 0.6;
    transition: 0.2s opacity;
  }
  .options-page-link:hover {
    opacity: 1;
  }

</style>

<div class="main-page">
  {#if $bookmarks !== null}
    {#if $bookmarks.isRoot && multiLevelRootFolder}
      {#each $bookmarks.children as folder}
        {#if folder.children.length !== 0}
          <Folder folder={folder} currentFolderId={$bookmarks.id} />
        {/if}
      {/each}
    {:else}
      <Folder
        folder={$bookmarks}
        currentFolderId={$bookmarks.id}
        title={$bookmarks.isRoot && !multiLevelRootFolder ? 'Favorites' : undefined }
      />
    {/if}
  {/if}
  <div class="options-page-link" title="Settings" on:click={openOptionsPage}></div>
</div>


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
    color: var(--main-text-color);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Ubuntu", "Helvetica Neue", sans-serif;
    -moz-osx-font-smoothing: grayscale;
  }

  .main-page {
    background-color: var(--main-bg-color);
    padding: 2rem;
    min-height: 100vh;
  }
</style>

<div class="main-page">
  {#if $bookmarks !== null}
    {#if $bookmarks.isRoot && multiLevelRootFolder}
      {#each $bookmarks.children as folder}
        <Folder folder={folder} currentFolderId={$bookmarks.id} />
      {/each}
    {:else}
      <Folder folder={$bookmarks} currentFolderId={$bookmarks.id} title={$bookmarks.isRoot && !multiLevelRootFolder ? 'Favorites' : undefined } />
    {/if}
  {/if}
</div>


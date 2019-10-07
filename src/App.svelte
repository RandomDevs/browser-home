<script>
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { getStore, getBookmarks } from './utils/browser'

  const bookmarks = writable(null)
  onMount(async () => {

    const store = await getStore()
    $bookmarks = await getBookmarks(store.bookmarkFolderId)
  })
</script>

<style>
</style>

<h1>Webstartsfdsfaf</h1>
{#if $bookmarks !== null}
  {#each $bookmarks.children as bookmark}
    <div>
      bookmark: {bookmark.title}
    </div>
  {/each}
{/if}

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

<h1>Hej svejs i sajberrymden</h1>
<div class="bookmarks-container">
  {#if $bookmarks !== null}
    {#each $bookmarks.children as bookmark}
      <div class="bookmarks-item">
        <div class="bookmarks-item-icon"></div>
        <div class="bookmarks-item-name">{bookmark.title}</div>
      </div>
    {/each}
  {/if}
</div>

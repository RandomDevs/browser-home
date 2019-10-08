<script>
  import { setCurrentFolderId, bookmarks } from './store'

  function onClick(event) {
    setCurrentFolderId($bookmarks.parentId)
  }
</script>

{#if $bookmarks.isRoot !== true}
  <div on:click={onClick}>Back</div>
{/if}


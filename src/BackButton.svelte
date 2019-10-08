<script>
  import { setCurrentFolderId, bookmarks } from './store'

  function onClick(event) {
    setCurrentFolderId($bookmarks.parentId)
  }
</script>

<style>
  :root {
    --back-button-bg-color: #e5e5e5;
    --back-button-bg-color-hover: #ccc;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --back-button-bg-color: #333;
      --back-button-bg-color-hover: #444;
    }
  }

  .back-button {
    background-color: var(--back-button-bg-color);
    display: inline-block;
    border-radius: 2px;
    background-image: url("/icon-back.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    width: 32px;
    height: 32px;
    margin-right: 1rem;
  }

  .back-button:hover {
    background-color: var(--back-button-bg-color-hover);
  }
</style>

{#if $bookmarks.isRoot !== true}
  <div
    class="back-button"
    on:click={onClick}
    title="Back">
  </div>
{/if}


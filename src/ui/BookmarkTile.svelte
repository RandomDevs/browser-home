<script>
  import BookmarkContextMenuButton from './BookmarkContextMenuButton.svelte'
  export let bookmark
  let child
  let hoveringBookmarkTile = false
  let shouldShowContextMenuButton
  function enter() { hoveringBookmarkTile = true  }
  function leave() { hoveringBookmarkTile = false }
</script>

<style>
  .bookmark-tile {
    cursor: pointer;
    position: relative;
    width: var(--tile-size);
  }
  .bookmark-tile-icon {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: var(--tile-bg-color);
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(12, 12, 13, 0.1);
    height: var(--tile-size);
    width: var(--tile-size);
  }
  .bookmark-tile-no-icon {
    align-items: center;
    display: flex;
    font-size: 3rem;
    justify-content: center;
    text-align: center;
  }
  .bookmark-tile-letter {
    color: #aaa;
  }
  .bookmark-tile-name {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: var(--tile-size);
  }
  .bookmark-tile,
  .bookmark-tile a,
  .bookmark-tile a:hover {
    color: var(--main-text-color);
    text-decoration: none;
  }
</style>

<div
  class="bookmark-tile"
  on:mouseenter={enter}
  on:mouseleave={leave}
>

  {#if hoveringBookmarkTile || shouldShowContextMenuButton}
    <BookmarkContextMenuButton
      bookmark={bookmark}
      bind:shouldShowContextMenuButton
    />
  {/if}

  <a href="{bookmark.url}">

    {#if bookmark.iconUrl}

      <div
        class="bookmark-tile-icon"
        style="background-image:url('{bookmark.iconUrl}'">
      </div>

    {:else}

      <div class="bookmark-tile-icon bookmark-tile-no-icon">
        <div class="bookmark-tile-letter">
          {bookmark.title.charAt(0).toUpperCase()}
        </div>
      </div>

    {/if}

    <div class="bookmark-tile-name">{bookmark.title}</div>

  </a>

</div>


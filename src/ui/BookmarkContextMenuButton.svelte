<script>
  import { scale } from 'svelte/transition'
  import BookmarkContextMenu from './BookmarkContextMenu.svelte'

  export let bookmark
  export let shouldShowContextMenuButton = false
  let child
  let contextMenuEl
  let contextMenuOpen = false

  function isExcluded(target) {
    let parent = target
    const exclude = [ contextMenuEl ]
    while (parent) {
      if (exclude.indexOf(parent) >= 0 || parent === child) {
        return true
      }
      parent = parent.parentNode
    }
    return false
  }

  function onClickOutside(event) {
    if (!isExcluded(event.target)) {
      contextMenuOpen = false
    }
  }

  function toggleMenu(event) {
    // Don't close menu if onClick event is children of menu button
    if (event.target === child) {
      contextMenuOpen = !contextMenuOpen
    }
  }

  $: if (contextMenuOpen) {
    shouldShowContextMenuButton = true
  } else {
    shouldShowContextMenuButton = false
  }
</script>

<style>
  .context-menu-button {
    background-color: #fff;
    background-image: url('meatballs.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 16px;
    border-radius: 50%;
    border: 2px solid #ababad;
    height: 26px;
    letter-spacing: -2px;
    position: absolute;
    right: -10px;
    text-align: center;
    top: -10px;
    width: 26px;
    z-index: 1000;
  }
  @media (prefers-color-scheme: dark) {
    .context-menu-button {
      background-image: url('meatballs-dark-mode.svg');
      background-color: #2a2a2e;
    }
  }
</style>

<svelte:body on:click={onClickOutside} />

<div
  bind:this={child}
  class:visible={shouldShowContextMenuButton}
  class="context-menu-button"
  in:scale="{{ duration: 200, delay: 500, opacity: 1, start: 0 }}"
  out:scale="{{ duration: 150, delay: 0, opacity: 1, start: 0 }}"
  on:click={toggleMenu}
>
  {#if contextMenuOpen}
    <BookmarkContextMenu bind:this={contextMenuEl} bookmark={bookmark} />
  {/if}
</div>

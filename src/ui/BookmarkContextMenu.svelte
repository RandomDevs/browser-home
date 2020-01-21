<script>
  import { get } from 'svelte/store'
  import { onMount } from 'svelte'
  import { iconStore } from './store'
  import { convertBlobToBase64 } from '../lib/downloadIcon'

  export let bookmark
  export let contextMenuOpen

  let fileInput
  let contextMenuEl
  let openToLeft = false

  async function handleFile(event) {
    const uploadedFile = event.target.files[0]
    const dataInBase64 = await convertBlobToBase64(uploadedFile)
    get(iconStore).store(bookmark.id, dataInBase64)
    contextMenuOpen = false
  }

  onMount(async () => {
    // Open context menu to the left if there is a lack of space to the right
    const margin = 10
    const contextMenuBox = contextMenuEl.getBoundingClientRect()
    const spaceLeftToRight = window.innerWidth - contextMenuBox.left
    openToLeft = (spaceLeftToRight < contextMenuBox.width + margin)
  })

</script>

<style>
  .context-menu {
    background-color: #f9f9fa;
    border-radius: 5px;
    box-shadow: 2px 3px 10px rgba(0,0,0,0.3);
    cursor: default;
    display: inline-block;
    left: 15px;
    letter-spacing: normal;
    min-width: 170px;
    padding: 5px 0;
    position: absolute;
    text-align: left;
    top: 15px;
    white-space: nowrap;
  }
  .context-menu.left {
    left: auto;
    right: 15px;
  }
  .context-menu-item:hover {
    background-color: #ededf0;
  }
  .context-menu-item {
    font-size: 0.9rem;
    padding: 4px 14px;
    width: 100%;
  }
  @media (prefers-color-scheme: dark) {
    .context-menu {
      background-color: #4a4a4f;
      color: #d6d6d8;
    }
    .context-menu-item:hover {
      background-color: #5c5c61;
    }
  }
</style>

<div class="context-menu{openToLeft ? ' left' : ''}" bind:this={contextMenuEl}>
  <label for="file-input-{bookmark.id}" class="context-menu-item">
    Upload custom icon…
  </label>
</div>

<input
  style="width:0;height:0;margin:0;padding:0;opacity:0"
  id="file-input-{bookmark.id}"
  on:change={handleFile}
  type="file"
>

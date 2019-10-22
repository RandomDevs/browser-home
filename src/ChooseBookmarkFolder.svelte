<script>
  import { onMount } from 'svelte'
  import { getCurrentFolderId } from './store'
  import { getAllBookmarkFolders, setBookmarkFolderId } from './utils/browser'
  import FolderOption from './FolderOption.svelte'

  let folderId

  onMount(async () => {
    folderId = await getCurrentFolderId()
  })

  function chooseFolder(id) {
    folderId = id
  }

  async function save() {
    await setBookmarkFolderId(folderId)

    test = folderId
  }
</script>

<style>
</style>

{#await getAllBookmarkFolders() then folderTree }
  <ul>
    {#each folderTree.children as folder}
      <FolderOption folder={folder} onClick={chooseFolder} chosenFolderId={folderId} />
    {/each}
  </ul>
  <button on:click={save}>Save</button>
{/await}

<script>
  import { onMount } from 'svelte'
  import { getCurrentFolderId } from './store'
  import { getAllBookmarkFolders, setBookmarkFolderId } from './utils/browser'

  let folderId
  let bookmarkOptions = []

  function flattenBookmarkTree(tree, indent=0) {
    return tree.reduce((acc, item) => {
      const itemArr = [{ id: item.id, title: item.title, indent }]
      return (item.children.length === 0)
        ? acc.concat(itemArr)
        : acc.concat(itemArr, flattenBookmarkTree(item.children, indent + 1))
    }, [])
  }

  onMount(async () => {
    folderId = await getCurrentFolderId()
    const bookmarkTree = await getAllBookmarkFolders()
    bookmarkOptions = flattenBookmarkTree(bookmarkTree.children)
  })

  async function save(event) {
    await setBookmarkFolderId(event.target.value)
  }
</script>

<style>
  .label {
    font-size: 1rem;
    margin-bottom: 4px;
    margin-top: 10px;
  }
</style>

<label for="select-home-folder" class="label">
  Home folder
</label>
<select
  {folderId}
  class="select"
  id="select-home-folder"
  on:change={save}
  bind:value={folderId}
>
  {#each bookmarkOptions as option }
    <option value={option.id} selected={option.id === folderId}>
      {'     '.repeat(option.indent)}📁 {option.title}
    </option>
  {/each}
</select>

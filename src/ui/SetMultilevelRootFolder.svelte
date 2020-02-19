<script>
  import { onMount } from 'svelte'
  import { getStoreValue, setStoreValue } from './utils/browser'

  let multiLevelRootFolder

  onMount(async () => {
    multiLevelRootFolder = await getStoreValue('multiLevelRootFolder')
  })

  async function save(event) {
    await setStoreValue('multiLevelRootFolder', event.target.checked)
  }
</script>

<style>
  .label {
    margin-bottom: 4px;
    margin-top: 10px;
  }
</style>

<div>
  <label class="label">
    <input type="checkbox" bind:checked={multiLevelRootFolder} on:change={save}>
    Display multi levels in root folder
  </label>
</div>

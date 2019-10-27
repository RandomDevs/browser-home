<script>
  import { onMount } from 'svelte'
  import { setupStore } from './store'
  import Options from './Options.svelte'
  import NewTab from './NewTab.svelte'

  onMount(async () => {
    await setupStore()
  })

  function isOptionsPage() {
    return window.location.search
      .replace('?', '')
      .split('&')
      .find(qs => qs.split('=')[0] === 'options')
  }
</script>

<style>
</style>

{#if isOptionsPage()}
  <Options />
{:else}
  <NewTab />
{/if}

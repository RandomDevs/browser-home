<script>
  export let folder
  export let onClick
  export let chosenFolderId

  function onClickLink(event) {

    event.preventDefault()
    onClick(folder.id)
  }
</script>

<style>
  .chosen {
    font-weight: bold
  }
</style>

<li>
  {#if folder.id === chosenFolderId}
    <span class="chosen">{folder.title}</span>
  {:else}
    <a href="#" on:click={onClickLink}>{folder.title}</a>
  {/if}

  {#if folder.children.length > 0}
    <ul>
      {#each folder.children as child}
        <svelte:self folder={child} onClick={onClick} chosenFolderId={chosenFolderId} />
      {/each}
    </ul>
  {/if}
</li>

<script>
  export let name
  export let isEmptyFolder = false
</script>

<style>
  .folder-tile {
    cursor: pointer;
  }
  .folder-tile.folder-tile-empty-folder {
    cursor: default;
  }
  .folder-tile-icon {
    background-image: url("/icon-folder.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 35%;
    background-color: var(--tile-bg-color);
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(12, 12, 13, 0.1);
    display: inline-block;
    height: var(--tile-size);
    width: var(--tile-size);
  }
  .folder-tile-name {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: var(--tile-size);
  }
  .folder-tile-empty-folder .folder-tile-icon {
    background-image: url("/icon-folder-empty.svg");
  }
</style>

<div class="folder-tile" class:folder-tile-empty-folder={isEmptyFolder}>
  <div class="folder-tile-icon"></div>
  <div class="folder-tile-name">{name}</div>
</div>


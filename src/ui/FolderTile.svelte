<script>
  export let name
</script>

<style>
  .folder-tile-icon {
    background-image: url("/icon-folder.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 35%;
    background-color: var(--tile-bg-color);
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(12, 12, 13, 0.1);
    cursor: pointer;
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
</style>

<div class="folder-tile">
  <div class="folder-tile-icon"></div>
  <div class="folder-tile-name">{name}</div>
</div>


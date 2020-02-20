<script>
  import ChooseBookmarkFolder from './ChooseBookmarkFolder.svelte'
  import SetMultilevelRootFolder from './SetMultilevelRootFolder.svelte'
  import {
    TYPE_CHROME,
    TYPE_EDGE,
    identifyBrowser,
  } from '../lib/identifyBrowser.js'

  let browser = ''

  $: switch (identifyBrowser()) {
    case TYPE_CHROME:
      browser = 'chrome'
      break
    case TYPE_EDGE:
      browser = 'edge'
      break
    default:
      browser = ''
  }
</script>

<style>
  :global(body) {
    background-color: var(--options-page-bg-color);
  }
  .options-page {
    color: var(--options-page-color);
    font-weight: 400;
    font-size: 14px;
    min-height: 250px;
  }
  .options-page.chrome {
    margin: 1.5rem;
    min-height: auto;
  }
  .options-page.edge {
    margin: 1.5rem;
    min-height: auto;
  }
</style>

<div class="options-page {browser}">
  <ChooseBookmarkFolder />
  <SetMultilevelRootFolder />
</div>

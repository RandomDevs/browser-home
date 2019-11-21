const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const fs = require('fs').promises
const path = require('path')
const md5File = require('md5-file/promise')
const { promisify } = require('util')
const imageSize = promisify(require('image-size'))
const { fetchIconUrl } = require('../lib/fetchIconUrl')
const { saveIcon, UnhandledContentTypeError } = require('../lib/downloadIcon')

const MINIMUM_ICON_SIZE = 50 * 50

const { DOMParser } = new JSDOM().window

async function downloadIcon(url, outputDirectoryPath) {

  try {

    const iconUrl = await fetchIconUrl(url, false, { fetch, DOMParser })
    if (!iconUrl) {
      return null
    }

    const filename = await saveIcon(iconUrl, outputDirectoryPath, { fetch, fs, path })
    return filename

  } catch (error) {

    if (error instanceof UnhandledContentTypeError) {
      console.warn(`Skipping ${url} because icon returned unhandled content type`)
    } else if (error instanceof fetch.FetchError) {
      console.warn(`Skipping ${url} becuase download failed:`, error.code)
    } else {
      console.error(`Error: Could not download icon for ${url}`, error)
    }
  }

  return null
}

async function fetchDomainList(filePath) {

  const content = await fs.readFile(filePath, { encoding: 'utf-8' })
  return content.split('\n')
}

async function cleanupIconDuplicates(domainStore, outputDirectoryPath) {

  const newStore = {}
  const hashes = new Map()

  for (const domain of Object.keys(domainStore)) {

    try {

      let fileName = domainStore[domain]
      const filePath = path.join(outputDirectoryPath, fileName)
      const fileHash = await md5File(filePath) // eslint-disable-line no-await-in-loop

      if (hashes.has(fileHash)) {
        // Already exist, use this file instead
        try {
          console.log(`Deleting hash ${fileHash}, file ${filePath}`)
          await fs.unlink(filePath) // eslint-disable-line no-await-in-loop
        } catch (err) {
          console.warn('Could not delete file', filePath)
        }

        fileName = hashes.get(fileHash)
      } else {
        hashes.set(fileHash, fileName)
      }

      newStore[domain] = fileName
    } catch (error) {
      console.error(`Got error when cleaning up domain ${domain}`, error)
      throw error
    }
  }

  return newStore
}

async function removeSmallIcons(domainStore, outputDirectoryPath) {

  const store = {}

  for (const domain of Object.keys(domainStore)) {

    try {

      const fileName = domainStore[domain]
      const filePath = path.join(outputDirectoryPath, fileName)
      const { width, height } = await imageSize(filePath) // eslint-disable-line no-await-in-loop
      const size = width * height

      if (size >= MINIMUM_ICON_SIZE) {
        store[domain] = fileName
      } else {
        console.log(`Icon does not match requirements for domain ${domain}, file ${filePath}`)
        await fs.unlink(filePath) // eslint-disable-line no-await-in-loop
      }
    } catch (error) {
      console.log(`Got error while testing size for ${domain}`, error)
      throw error
    }
  }

  return store
}

async function run(domainFilepath, outputDirectoryPath) {

  // Check if output directory exists
  try {
    await fs.access(outputDirectoryPath)
  } catch (error) {
    console.error('Error: Output directory is not accessable')
    process.exit(1)
  }

  const domains = await fetchDomainList(domainFilepath)
  let counter = 0
  let store = {}

  for (const domain of domains) {

    try {

      console.log(`[${counter + 1}/${domains.length}] Downloading iconUrl for ${domain}`)

      const url = `http://${domain}`
      const filename = await downloadIcon(url, outputDirectoryPath) // eslint-disable-line no-await-in-loop
      console.log(`Got filename ${filename}`)

      if (filename !== null) {
        store[domain] = filename
      }

      counter += 1
    } catch (error) {
      console.error('Uncaught error was thrown', error)
    }
  }

  console.log('Remove small icons')
  store = await removeSmallIcons(store, outputDirectoryPath)

  console.log('Cleaning up icon duplicates')
  store = await cleanupIconDuplicates(store, outputDirectoryPath)

  console.log('Done cleaning duplicates. Writing file')
  const json = JSON.stringify(store)
  const outputJsonFile = path.join(outputDirectoryPath, 'domains.json')
  await fs.writeFile(outputJsonFile, json, { encoding: 'utf-8' })

  console.log('Done')
}

if (process.argv[3] === undefined) {

  console.error('Usage: node download-icons.js [filepath to domainlist txt] [output directory]')
  process.exit(1)
}

run(process.argv[2], process.argv[3])

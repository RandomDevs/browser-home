/* eslint-disable no-await-in-loop */

const fs = require('fs').promises

function parseVersion(version) {
  return version.match(/refs\/tags\/v([\d.]+)/)[1]
}

async function run(version) {

  const manifestFilePaths = ['./public/firefox.manifest.json', './public/chrome.manifest.json']

  for (const manifestFilePath of manifestFilePaths) {

    // Check if output directory exists
    try {
      await fs.access(manifestFilePath)
    } catch (error) {
      console.error('Error: Manifest file is not accessable')
      process.exit(1)
    }

    const content = await fs.readFile(manifestFilePath, { encoding: 'utf-8' })
    const json = JSON.parse(content)

    json.version = parseVersion(version)

    const dataToStore = JSON.stringify(json, null, 2)
    await fs.writeFile(manifestFilePath, dataToStore, { encoding: 'utf-8' })

    console.log(`Updated version in ${manifestFilePaths} to ${parseVersion(version)}`)
  }
}

if (process.argv[2] === undefined) {

  console.error('Usage: node version.js [version]')
  process.exit(1)
}

run(process.argv[2])

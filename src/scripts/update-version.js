const fs = require('fs').promises

function parseVersion(version) {
  return version.split('/').reduce((_, val) => val)
}

async function run(version) {

  const manifestFilePath = './public/manifest.json'

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

  console.log(`Updated version in manifest to ${parseVersion(version)}`)
}

if (process.argv[2] === undefined) {

  console.error('Usage: node version.js [version]')
  process.exit(1)
}

run(process.argv[2])

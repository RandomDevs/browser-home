const fs = require('fs').promises
const fetch = require('node-fetch')
const Zip = require('adm-zip')

async function getListDataFromResponse(response) {

  const buffer = await response.buffer()

  const zip = new Zip(buffer)
  const files = zip.getEntries()

  for (const file of files) {

    const filename = file.entryName.toLowerCase()
    if (filename.endsWith('.txt')) {
      return file.getData().toString('utf-8')
    }
  }

  throw new Error('Could not find any txt list from website list response')
}

async function fetchTopMillionWebsitesList() {

  console.log('Downloading top million websites list...')
  const url = 'https://ak.quantcast.com/quantcast-top-sites.zip'
  const response = await fetch(url)

  console.log('Download complete. Parsing...')
  return getListDataFromResponse(response)
}

/*
function fetchTopMillionWebsitesList() {
  return fs.readFile('./resources/Quantcast-Top-Million.txt', { encoding: 'utf-8' })
}
*/

function transformTextToSet(text) {

  const validDomains = text
    .split('\r\n')
    .reduce((acc, row, index) => {

      if (row.startsWith('#')) {
        return acc
      }

      const [, domain] = row.split('\t')
      if (domain && domain.indexOf('.') > 0) {
        acc.push(domain)
      }

      return acc
    }, [])

  return new Set(validDomains)
}

async function fetchBlockedDomainsList() {

  const url = 'https://disconnect.me/trackerprotection/blocked'
  const response = await fetch(url)
  const content = await response.text()
  const text = content.replace(/<\/?[^>]+(>|$)/g, '')

  return text
    .split('\n')
    .filter(domain => domain.length > 0 && domain.indexOf('.') > 0)
    .map(domain => {

      const d = domain.trim()
      if (d.startsWith('www.')) {
        return d.substring('www.'.length)
      }
      return d
    })
}

async function run(outputFilepath) {

  if (outputFilepath === undefined) {
    console.error('Error: Enter a file path using "node ./update-blocklist.js outputfile.txt"')
    process.exit(1)
  }

  console.log('Downloading files...')
  const topWebsitesTxt = await fetchTopMillionWebsitesList()
  const blockedDomainsList = await fetchBlockedDomainsList()

  const topWebsites = transformTextToSet(topWebsitesTxt)
  const blockedDomains = new Set(blockedDomainsList)

  console.log('Download completed, parsing and saving.')
  const blockedTopDomains = Array.from(blockedDomains.values()).filter(domain => topWebsites.has(domain))
  await fs.writeFile(outputFilepath, blockedTopDomains.join('\n'))

  console.log('Saving completed')
}

run(process.argv[2])


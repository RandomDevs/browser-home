
function cleanDomainNameFromUrl(url) {

  const domain = (new URL(url)).host
  if (domain.startsWith('www.')) {
    return domain.substring('www.'.length)
  }

  return domain
}

module.exports = {
  cleanDomainNameFromUrl,
}

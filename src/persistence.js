function getUrlParams(query) {
  return query.substring(1).split('&').reduce((akku, part) => { const parts = part.split('='); akku[parts[0]] = decodeURIComponent(parts[1]); return akku; }, {});
}

function createUrl(opts) {
  return `${location.pathname}?code=${encodeURIComponent(opts.code || '')}&grep=${encodeURIComponent(opts.grep || '')}`;
}

function save(code) {
  const url = createUrl({
    code,
    grep: getUrlParams(location.search).grep
  })
  history.replaceState(undefined, undefined, url);
}

module.exports = {
    getUrlParams,
    createUrl,
    save
};

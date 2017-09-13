

const isGhPages = () => window.location.href.indexOf('ridicorp.com') > -1;

const getUrl = relativeUrl => isGhPages() ? `https://ridi.github.io/react-webviewer/demo/${relativeUrl}` : relativeUrl;

export const getJson = relativeUrl => fetch(getUrl(relativeUrl)).then(resp => resp.json());

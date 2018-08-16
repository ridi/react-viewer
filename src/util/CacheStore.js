import { isEmpty } from './Util';

let cache = {};

export const cached = (cacheName, func) => () => {
  if (typeof cache[cacheName] === 'undefined') {
    cache[cacheName] = func();
  }
  return cache[cacheName];
};

export const clearCache = (...cacheNames) => {
  if (isEmpty(cacheNames)) {
    cache = {};
    return;
  }
  cacheNames.forEach((cacheName) => { delete cache[cacheName]; });
};

import { debounce } from './Util';

// TODO 리팩토링
let cache = {};

const cached = (cacheName, func) => () => {
  if (typeof cache[cacheName] === 'undefined') {
    cache[cacheName] = func();
  }
  return cache[cacheName];
};

window.addEventListener('resize', debounce(() => { cache = {}; }, 0));

export const screenWidth = cached('screenWidth', () => window.innerWidth);

export const screenHeight = cached('screenHeight', () => window.innerHeight);

export const scrollTop = () => {
  if (document.scrollingElement) {
    return document.scrollingElement.scrollTop;
  }
  return document.documentElement.scrollTop || document.body.scrollTop;
};

export const scrollHeight = () => {
  if (document.scrollingElement) {
    return document.scrollingElement.scrollHeight;
  }
  return document.documentElement.scrollHeight || document.body.scrollHeight;
};

export const setScrollTop = (top) => {
  if (document.scrollingElement) {
    document.scrollingElement.scrollTop = top;
  } else {
    document.body.scrollTop = top;
    document.documentElement.scrollTop = top;
  }
};

export const offsetWidth = () => document.body.offsetWidth;

export const offsetHeight = () => document.body.offsetHeight;

export const documentAddClassList = classList => document.body.classList.add(classList);

export const documentAppendChild = dom => document.body.appendChild(dom);

export const documentAddEventListener = (type, listener, useCapture) => document.addEventListener(type, listener, useCapture);

export const documentRemoveEventListener = (type, listener, useCapture) => document.removeEventListener(type, listener, useCapture);

export default {
  screenWidth,
  screenHeight,
  scrollTop,
  scrollHeight,
  setScrollTop,
  offsetWidth,
  offsetHeight,
  documentAddClassList,
  documentAppendChild,
  documentAddEventListener,
  documentRemoveEventListener,
};

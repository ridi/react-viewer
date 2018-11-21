/* eslint no-restricted-globals: 0 */
import { debounce, isExist } from './Util';
import DOMEventConstants from '../constants/DOMEventConstants';
import { cached, clearCache } from './CacheStore';
import { addEventListener } from './EventHandler';

const Window = isExist(window) ? window : { addEventListener: () => {}, scrollBy: () => {} };
const Document = isExist(document) ? document : { body: {}, scrollingElement: {}, documentElement: {} };

export const screenWidth = cached('screenWidth', () => Window.innerWidth);

export const screenHeight = cached('screenHeight', () => Window.innerHeight);

addEventListener(Window, DOMEventConstants.RESIZE, debounce(() => { clearCache('screenWidth', 'screenHeight'); }, 0));

export const scrollLeft = () => {
  if (Document.scrollingElement) return Document.scrollingElement.scrollLeft;
  return Document.documentElement.scrollLeft || Document.body.scrollLeft;
};

export const scrollTop = () => {
  if (Document.scrollingElement) return Document.scrollingElement.scrollTop;
  return Document.documentElement.scrollTop || Document.body.scrollTop;
};

export const scrollHeight = () => {
  if (Document.scrollingElement) return Document.scrollingElement.scrollHeight;
  return Document.documentElement.scrollHeight || Document.body.scrollHeight;
};

export const setScrollTop = (top) => {
  if (Document.scrollingElement) {
    Document.scrollingElement.scrollTop = top;
  } else {
    Document.body.scrollTop = top;
    Document.documentElement.scrollTop = top;
  }
};

export const { scrollBy } = Window;

export const offsetWidth = () => Document.body.offsetWidth;

export const offsetHeight = () => Document.body.offsetHeight;

export const waitThenRun = requestAnimationFrame || setTimeout || (func => func());

export default {
  screenWidth,
  screenHeight,
  scrollTop,
  scrollHeight,
  scrollBy,
  setScrollTop,
  offsetWidth,
  offsetHeight,
  waitThenRun,
};

/* eslint no-restricted-globals: 0 */
import { fromEvent, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { isExist } from './Util';
import DOMEventConstants from '../constants/DOMEventConstants';
import { cached, clearCache } from './CacheStore';

const Window = isExist(window) ? window : { addEventListener: () => {}, scrollBy: () => {} };
const Document = isExist(document) ? document : { body: {}, scrollingElement: {}, documentElement: {} };

fromEvent(Window, DOMEventConstants.RESIZE).pipe(
  debounce(() => timer(0)),
).subscribe(() => clearCache('screenWidth', 'screenHeight'));

export const screenWidth = cached('screenWidth', () => Window.innerWidth);

export const screenHeight = cached('screenHeight', () => Window.innerHeight);

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

export const scrollTo = (top, left) => {
  Window.scrollTo(left, top);
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
  scrollTo,
};

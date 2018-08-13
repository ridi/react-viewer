/* eslint no-restricted-globals: 0 */
import { debounce, isExist } from './Util';
import DOMEventConstants from '../constants/DOMEventConstants';
import { cached, clearCache } from './CacheStore';

export const screenWidth = cached('screenWidth', () => window.innerWidth);

export const screenHeight = cached('screenHeight', () => window.innerHeight);

export const scrollTop = () => {
  if (document.scrollingElement) return document.scrollingElement.scrollTop;
  return document.documentElement.scrollTop || document.body.scrollTop;
};

export const scrollHeight = () => {
  if (document.scrollingElement) return document.scrollingElement.scrollHeight;
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

/**
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 * @returns {boolean}
 */
const testSupportsPassive = cached('testSupportsPassive', () => {
  let supportsPassive = false;
  try {
    /* eslint getter-return: 0 */
    const opts = Object.defineProperty({}, 'passive', { get: () => { supportsPassive = true; } });
    /* eslint getter-return: 1 */
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) { /* nothing */ }
  return supportsPassive;
});

export const addEventListener = (element, eventName, listener, options) => {
  if (!isExist(element)) return;
  if (typeof options === 'object' && !testSupportsPassive()) {
    element.addEventListener(eventName, listener, options.capture ? options.capture : false);
  } else {
    element.addEventListener(eventName, listener, options);
  }
};

export const removeEventListener = (element, eventName, listener, options) => {
  if (!isExist(element)) return;
  if (typeof options === 'object' && !testSupportsPassive()) {
    element.removeEventListener(eventName, listener, options.capture ? options.capture : false);
  } else {
    element.removeEventListener(eventName, listener, options);
  }
};

const preventDefault = e => e.preventDefault();

export const allowScrollEvent = (ref) => {
  if (isExist(ref)) {
    removeEventListener(ref, DOMEventConstants.SCROLL, preventDefault, { passive: false });
    removeEventListener(ref, DOMEventConstants.TOUCH_MOVE, preventDefault, { passive: false });
    removeEventListener(ref, DOMEventConstants.MOUSE_WHEEL, preventDefault, { passive: false });
  }
};

export const preventScrollEvent = (ref) => {
  allowScrollEvent(ref);
  if (isExist(ref)) {
    addEventListener(ref, DOMEventConstants.SCROLL, preventDefault, { passive: false });
    addEventListener(ref, DOMEventConstants.TOUCH_MOVE, preventDefault, { passive: false });
    addEventListener(ref, DOMEventConstants.MOUSE_WHEEL, preventDefault, { passive: false });
  }
};

export const redirect = (url) => {
  document.location = url;
  document.location.href = url;
  window.location = url;
  window.location.href = url;
  location.href = url;
};

addEventListener(window, DOMEventConstants.RESIZE, debounce(() => { clearCache('screenWidth', 'screenHeight'); }, 0));

export default {
  screenWidth,
  screenHeight,
  scrollTop,
  scrollHeight,
  setScrollTop,
  offsetWidth,
  offsetHeight,
  addEventListener,
  removeEventListener,
  allowScrollEvent,
  preventScrollEvent,
  redirect,
};

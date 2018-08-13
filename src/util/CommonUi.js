/* eslint no-restricted-globals: 0 */
import { screenHeight } from './BrowserWrapper';
import { isExist } from './Util';
import DOMEventConstants from '../constants/DOMEventConstants';
import { cached } from './CacheStore';

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

const _preventDefault = e => e.preventDefault();

export const removeScrollEvent = (ref) => {
  if (isExist(ref)) {
    removeEventListener(ref, DOMEventConstants.SCROLL, _preventDefault, { passive: false });
    removeEventListener(ref, DOMEventConstants.TOUCH_MOVE, _preventDefault, { passive: false });
    removeEventListener(ref, DOMEventConstants.MOUSE_WHEEL, _preventDefault, { passive: false });
  }
};

export const preventScrollEvent = (ref) => {
  removeScrollEvent(ref);
  if (isExist(ref)) {
    addEventListener(ref, DOMEventConstants.SCROLL, _preventDefault, { passive: false });
    addEventListener(ref, DOMEventConstants.TOUCH_MOVE, _preventDefault, { passive: false });
    addEventListener(ref, DOMEventConstants.MOUSE_WHEEL, _preventDefault, { passive: false });
  }
};

export const pageUp = () => window.scrollTo(0, window.scrollY - (screenHeight() * 0.9));

export const pageDown = () => window.scrollTo(0, window.scrollY + (screenHeight() * 0.9));

export const redirect = (url) => {
  document.location = url;
  document.location.href = url;
  window.location = url;
  window.location.href = url;
  location.href = url;
};

export default {
  addEventListener,
  removeEventListener,
  removeScrollEvent,
  preventScrollEvent,
  pageUp,
  pageDown,
  redirect,
};

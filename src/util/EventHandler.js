/* eslint no-restricted-globals: 0 */
import { isExist } from './Util';
import DOMEventConstants from '../constants/DOMEventConstants';
import { cached } from './CacheStore';

const Window = isExist(window) ? window : { addEventListener: () => {} };

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
    Window.addEventListener('testPassive', null, opts);
    Window.removeEventListener('testPassive', null, opts);
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

export default {
  addEventListener,
  removeEventListener,
  allowScrollEvent,
  preventScrollEvent,
};

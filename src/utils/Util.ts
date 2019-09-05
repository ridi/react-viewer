
export const getRootElement = (): Element | null => {
  if (document.scrollingElement) return document.scrollingElement;
  return document.documentElement || document.body;
};
export const getContentRootElement = (): HTMLElement | null => document.getElementById('content_root');
export const getContentContainerElement = (): HTMLElement | null => document.getElementById('content_container');

export const getScrollWidth = (): number => {
  const rootElement = getContentRootElement();
  return rootElement ? rootElement.scrollWidth : 0;
};

export const getScrollHeight = (): number => {
  const rootElement = getRootElement();
  return rootElement ? rootElement.scrollHeight : 0;
};

export const getScrollLeft = (): number => {
  const rootElement = getContentRootElement();
  return rootElement ? rootElement.scrollLeft : 0;
};

export const getScrollTop = (): number => {
  const rootElement = getRootElement();
  return rootElement ? rootElement.scrollTop : 0;
};

export const setScrollLeft = (scrollLeft: number): void => {
  const rootElement = getContentRootElement();
  if (rootElement) {
    rootElement.scrollLeft = scrollLeft;
  }
};

export const setScrollTop = (scrollTop: number): void => {
  const rootElement = getRootElement();
  if (rootElement) {
    rootElement.scrollTop = scrollTop;
  }
};

export const getClientWidth = (): number => document.documentElement.clientWidth;

export const getClientHeight = (): number => document.documentElement.clientHeight;

/**
 * Create a debounced(grouping multiple event listener in one) function
 * And the latest invoking of this deboucnced function will only be taken after `wait` miliseconds periods.
 *
 * @param {function} fn
 * @param {number} [wait=100]
 * @param {boolean} [immediate=false]
 * @return {function} debounced function
 */
export const debounce = (fn: () => any, wait: number = 100, immediate: boolean = false) => {
  let timeout: any | null;
  return (...args: []) => {
    if (immediate && !timeout) {
      // immediately run at the first time
      fn.apply(null, args);
    }
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(null, args);
    }, wait);
  };
};

/**
 * Create a throttled(invoking only once in specified limited time) function
 *
 * @param {function} fn
 * @param {number} [limit=100] up to 1 invoke per ${limit} milliseconds
 * @param {boolean} [delayed=false] invoke ${fn} after ${limit} milliseconds delayed
 * @returns {function} throttled function
 */
export const throttle = (fn: () => any, limit: number = 100, delayed: boolean = false) => {
  let inThrottle = false;
  return (...args: []) => {
    if (!inThrottle) {
      if (delayed) {
        setTimeout(() => fn.apply(null, args), limit);
      } else {
        fn.apply(null, args);
      }
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

export const sleep = async (millisecond: number = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, millisecond));
};

export const hasIntersect = (r1: number[], r2: number[]): boolean => (r1[0] < r2[0] ? r1[1] > r2[0] : r2[1] > r1[0]);

export const logger = console.log

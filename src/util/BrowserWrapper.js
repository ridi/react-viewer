
export const screenWidth = () => window.innerWidth;

export const screenHeight = () => window.innerHeight;

export const scrollTop = () => window.pageYOffset;
export const scrollLeft = () => window.pageXOffset;

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

export const scrollTo = (x, y) => window.scrollTo(x, y);
export const disableScrolling = () => {
  if (document.scrollingElement) {
    document.scrollingElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = 'hidden';
  }
};

export const enableScrolling = () => {
  if (document.scrollingElement) {
    document.scrollingElement.style.overflow = 'auto';
  } else {
    document.documentElement.style.overflow = 'auto';
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

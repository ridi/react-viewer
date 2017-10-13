
export const screenWidth = () => window.innerWidth;

export const screenHeight = () => window.innerHeight;

export const scrollTop = () => document.body.scrollTop;

export const scrollHeight = () => document.body.scrollHeight;

export const setScrollTop = top => {
  console.log('scrollTop', top);
  document.body.scrollTop = top;
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

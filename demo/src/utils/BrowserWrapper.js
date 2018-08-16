/* eslint no-restricted-globals: 0 */

export const screenWidth = () => window.innerWidth;
export const screenHeight = () => window.innerHeight;

export const scrollTop = () => {
  if (document.scrollingElement) return document.scrollingElement.scrollTop;
  return document.documentElement.scrollTop || document.body.scrollTop;
};

export const scrollHeight = () => {
  if (document.scrollingElement) return document.scrollingElement.scrollHeight;
  return document.documentElement.scrollHeight || document.body.scrollHeight;
};

export const redirect = (url) => {
  document.location = url;
  document.location.href = url;
  window.location = url;
  window.location.href = url;
  location.href = url;
};

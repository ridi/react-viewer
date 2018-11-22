export const LOG = Symbol('LOG');

export const LOADED = Symbol('LOADED');
export const UNLOADED = Symbol('UNLOADED');


export const RESIZE = Symbol('RESIZE');
export const SCROLL = Symbol('SCROLL'); // {scrollX, scrollY}
export const TOUCH = Symbol('TOUCH'); // {event, item}
export const TOUCH_ANNOTATION = Symbol('TOUCH_ANNOTATION'); // { id, serializedRange, rects, text, style, contentIndex }

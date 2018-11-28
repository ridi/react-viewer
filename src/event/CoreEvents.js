export const LOG = Symbol('LOG');

// Lifecycle
export const LOADED = Symbol('LOADED');
export const UNLOADED = Symbol('UNLOADED');


// User Actions
export const RESIZE = Symbol('RESIZE');
export const SCROLL = Symbol('SCROLL'); // {scrollX, scrollY}
export const TOUCH = Symbol('TOUCH'); // {event, item}
export const TOUCH_ANNOTATION = Symbol('TOUCH_ANNOTATION'); // { id, serializedRange, rects, text, style, contentIndex }
export const CHANGE_SELECTION = Symbol('CHANGE_SELECTION'); // { selection, selectionMode }

export const MOVE_TO_OFFSET = Symbol('MOVE_TO_OFFSET');

export const SETTING_UPDATED = Symbol('SETTING_UPDATED'); // updatedSetting

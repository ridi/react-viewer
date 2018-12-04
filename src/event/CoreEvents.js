export const LOG = Symbol('LOG');

// Lifecycle
export const RESTORE_STATE = Symbol('RESTORE_STATE'); // { metadata: { contentFormat, bindingType }, setting, contents, calculations }
export const MOUNTED = Symbol('MOUNTED');
export const UNMOUNTED = Symbol('UNMOUNTED');

// User Actions
export const RESIZE = Symbol('RESIZE');
export const SCROLL = Symbol('SCROLL'); // {scrollX, scrollY}
export const TOUCH = Symbol('TOUCH'); // {event, item}
export const TOUCH_ANNOTATION = Symbol('TOUCH_ANNOTATION'); // { id, serializedRange, rects, text, style, contentIndex }
export const CHANGE_SELECTION = Symbol('CHANGE_SELECTION'); // { selection, selectionMode }

export const MOVE_TO_OFFSET = Symbol('MOVE_TO_OFFSET');

export const UPDATE_CURRENT = Symbol('UPDATE_CURRENT');

export const MOVED = Symbol('MOVED');

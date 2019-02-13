export const LOG = Symbol('LOG');

export const MOUNTED = Symbol('MOUNTED');
export const UNMOUNTED = Symbol('UNMOUNTED');
export const MOVE_TO_OFFSET = Symbol('MOVE_TO_OFFSET');
export const MOVED = Symbol('MOVED');

export const RESIZE = Symbol('RESIZE');
export const SCROLL = Symbol('SCROLL'); // {scrollX, scrollY}
export const SCROLL_DEBOUNCED = Symbol('SCROLL_DEBOUNCED'); // {scrollX, scrollY}
export const TOUCH = Symbol('TOUCH'); // {event, item}

export const CHANGE_SELECTION = Symbol('CHANGE_SELECTION'); // { selection, selectionMode }
export const UPDATE_CURRENT_OFFSET = Symbol('UPDATE_CURRENT_OFFSET');

export const CONTENT_LOADED = Symbol('CONTENT_LOADED');
export const CONTENT_ERROR = Symbol('CONTENT_ERROR');
export const ALL_CONTENT_READY = Symbol('ALL_CONTENT_READY');
export const ALL_CONTENT_LOADED = Symbol('ALL_CONTENT_LOADED');

export const SET_CONTENTS_BY_URI = Symbol('SET_CONTENTS_BY_URI'); // { contentFormat, bindingType, uris }
export const SET_CONTENTS_BY_VALUE = Symbol('SET_CONTENTS_BY_VALUE'); // { contentFormat, bindingType, contents }
export const UPDATE_CONTENT = Symbol('UPDATE_CONTENT');

export const END_SELECTION = Symbol('END_SELECTION');

export const SET_ANNOTATIONS = Symbol('SET_ANNOTATIONS');
export const ADD_ANNOTATION = Symbol('ADD_ANNOTATION');
export const UPDATE_ANNOTATION = Symbol('UPDATE_ANNOTATION');
export const REMOVE_ANNOTATION = Symbol('REMOVE_ANNOTATION');
export const ANNOTATION_ADDED = Symbol('ANNOTATION_ADDED');
export const ANNOTATION_CHANGED = Symbol('ANNOTATION_CHANGED');

export const CALCULATION_INVALIDATED = Symbol('CALCULATION_INVALIDATED');
export const CALCULATION_UPDATED = Symbol('CALCULATION_UPDATED');
export const CALCULATIONS_SET = Symbol('CALCULATIONS_SET');
export const READY_TO_READ = Symbol('READY_TO_READ');
export const CALCULATION_COMPLETED = Symbol('CALUCLATION_COMPLETED');
export const CALCULATE_CONTENT = Symbol('CALCULATE_CONTENT');

export const UPDATE_SETTING = Symbol('UPDATE_SETTING');
export const SETTING_UPDATED = Symbol('SETTING_UPDATED');

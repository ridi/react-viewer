import ow from 'ow';

export enum ViewType {
  SCROLL = 'scroll',
  PAGE1 = 'page1',
  PAGE12 = 'page12',
  PAGE23 = 'page23',
}

export enum BindingType {
  LEFT = 'left',
  RIGHT = 'right',  // manga
}

export enum ImageStatus {
  NONE = 'none',
  LOADING = 'loading',
  ERROR = 'error',
  LOADED = 'loaded',
}

export const ViewTypeValidator = ow.string.oneOf([ViewType.SCROLL, ViewType.PAGE1, ViewType.PAGE23, ViewType.PAGE12]);
export const ViewTypeOptionalValidator = ow.optional.string.oneOf([ViewType.SCROLL, ViewType.PAGE1, ViewType.PAGE23, ViewType.PAGE12]);
export const BindingTypeValidator = ow.string.oneOf([BindingType.LEFT, BindingType.RIGHT]);
export const BindingTypeOptionalValidator = ow.optional.string.oneOf([BindingType.LEFT, BindingType.RIGHT]);

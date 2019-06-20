import {Reducer} from "react";
import { generateContext } from "../ContextProvider";
import { ViewType, BindingType } from '../../constants';

export enum ComicSettingActionType {
  UPDATE_SETTING = 'update_setting',
}

export enum ComicSettingProperties {
  VIEW_TYPE = 'viewType',
  CONTENT_WIDTH_IN_PERCENT = 'contentWidthInPercent',
  BINDING_TYPE = 'bindingType',
  LAZY_LOAD = 'lazyLoad',
}

export type ComicSettingAction = { type: ComicSettingActionType.UPDATE_SETTING, setting: Partial<ComicSettingState> };

export type ComicSettingState = {
  [ComicSettingProperties.VIEW_TYPE]: ViewType,
  [ComicSettingProperties.CONTENT_WIDTH_IN_PERCENT]: number,
  [ComicSettingProperties.BINDING_TYPE]: BindingType,
  [ComicSettingProperties.LAZY_LOAD]: boolean|number,
};

export const initialComicSettingState: ComicSettingState = {
  [ComicSettingProperties.VIEW_TYPE]: ViewType.SCROLL,
  [ComicSettingProperties.CONTENT_WIDTH_IN_PERCENT]: 100,  // % (50% ~ 100%)
  [ComicSettingProperties.BINDING_TYPE]: BindingType.LEFT,
  [ComicSettingProperties.LAZY_LOAD]: 5,    // maximum loading images in one time
};

export const ComicSettingReducer: Reducer<ComicSettingState, ComicSettingAction> = (state, action) => {
  switch(action.type) {
    case ComicSettingActionType.UPDATE_SETTING:
      return { ...state, ...action.setting };
    default:
      return state;
  }
};

export const {
  DispatchContext: ComicSettingDispatchContext,
  StateContext: ComicSettingContext,
  ContextProvider: ComicSettingContextProvider,
} = generateContext(ComicSettingReducer, initialComicSettingState, 'ComicSetting');

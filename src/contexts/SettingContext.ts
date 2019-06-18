import {Reducer} from "react";
import { generateContext } from "./ContextProvider";

export enum ViewType {
  SCROLL = 'scroll',
  PAGE1 = 'page1',
  PAGE12 = 'page12',
  PAGE23 = 'page23',
}

export enum SettingActionType {
  UPDATE_SETTING = 'update_setting',
}

export enum SettingProperties {
  VIEW_TYPE = 'viewType',
  FONT_SIZE_IN_EM = 'fontSizeInEm',
  LINE_HEIGHT_IN_EM = 'lineHeightInEm',
  CONTENT_PADDING_IN_PERCENT = 'contentPaddingInPercent',
  COLUMN_GAP_IN_PERCENT = 'columnGapInPercent',
  MAX_WIDTH = 'maxWidth',
  CONTAINER_HORIZONTAL_MARGIN = 'containerHorizontalMargin',
  CONTAINER_VERTICAL_MARGIN = 'containerVerticalMargin',
}

export type SettingAction = { type: SettingActionType.UPDATE_SETTING, setting: Partial<SettingState> };

export type SettingState = {
  [SettingProperties.VIEW_TYPE]: ViewType,
  [SettingProperties.FONT_SIZE_IN_EM]: number,
  [SettingProperties.LINE_HEIGHT_IN_EM]: number,
  [SettingProperties.CONTENT_PADDING_IN_PERCENT]: number,
  [SettingProperties.COLUMN_GAP_IN_PERCENT]: number,
  [SettingProperties.MAX_WIDTH]: number,
  [SettingProperties.CONTAINER_HORIZONTAL_MARGIN]: number,
  [SettingProperties.CONTAINER_VERTICAL_MARGIN]: number,
};

export const initialSettingState: SettingState = {
  [SettingProperties.VIEW_TYPE]: ViewType.SCROLL,
  [SettingProperties.FONT_SIZE_IN_EM]: 1,        // em (0.1em ~ 5.0em)
  [SettingProperties.LINE_HEIGHT_IN_EM]: 1.67,   // em (1.0 ~ 3.0)
  [SettingProperties.CONTENT_PADDING_IN_PERCENT]: 12, // % (0 ~ 25%)
  [SettingProperties.COLUMN_GAP_IN_PERCENT]: 5,  // % (1% ~ 20%)
  [SettingProperties.MAX_WIDTH]: 700,
  [SettingProperties.CONTAINER_HORIZONTAL_MARGIN]: 30,
  [SettingProperties.CONTAINER_VERTICAL_MARGIN]: 35,
  // contentWidthInPercent: 100,  // % (50% ~ 100%)
};

export const settingReducer: Reducer<SettingState, SettingAction> = (state, action) => {
  switch(action.type) {
    case SettingActionType.UPDATE_SETTING:
      return { ...state, ...action.setting };
    default:
      return state;
  }
};

export const {
  DispatchContext: SettingDispatchContext,
  StateContext: SettingContext,
  ContextProvider: SettingContextProvider,
} = generateContext(settingReducer, initialSettingState, 'Setting');

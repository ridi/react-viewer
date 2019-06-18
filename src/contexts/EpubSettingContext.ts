import {Reducer} from "react";
import { generateContext } from "./ContextProvider";
import { ViewType } from '../constants';

export enum EpubSettingActionType {
  UPDATE_SETTING = 'update_setting',
}

export enum EpubSettingProperties {
  VIEW_TYPE = 'viewType',
  FONT = 'font',
  FONT_SIZE_IN_EM = 'fontSizeInEm',
  LINE_HEIGHT_IN_EM = 'lineHeightInEm',
  CONTENT_PADDING_IN_PERCENT = 'contentPaddingInPercent',
  COLUMN_GAP_IN_PERCENT = 'columnGapInPercent',
  CONTAINER_HORIZONTAL_MARGIN = 'containerHorizontalMargin',
  CONTAINER_VERTICAL_MARGIN = 'containerVerticalMargin',
}

export type EpubSettingAction = { type: EpubSettingActionType.UPDATE_SETTING, setting: Partial<EpubSettingState> };

export type EpubSettingState = {
  [EpubSettingProperties.VIEW_TYPE]: ViewType,
  [EpubSettingProperties.FONT]: string,
  [EpubSettingProperties.FONT_SIZE_IN_EM]: number,
  [EpubSettingProperties.LINE_HEIGHT_IN_EM]: number,
  [EpubSettingProperties.CONTENT_PADDING_IN_PERCENT]: number,
  [EpubSettingProperties.COLUMN_GAP_IN_PERCENT]: number,
  [EpubSettingProperties.CONTAINER_HORIZONTAL_MARGIN]: number,
  [EpubSettingProperties.CONTAINER_VERTICAL_MARGIN]: number,
};

export const initialEpubSettingState: EpubSettingState = {
  [EpubSettingProperties.VIEW_TYPE]: ViewType.SCROLL,
  [EpubSettingProperties.FONT]: 'default',
  [EpubSettingProperties.FONT_SIZE_IN_EM]: 1,        // em (0.1em ~ 5.0em)
  [EpubSettingProperties.LINE_HEIGHT_IN_EM]: 1.67,   // em (1.0 ~ 3.0)
  [EpubSettingProperties.CONTENT_PADDING_IN_PERCENT]: 12, // % (0 ~ 25%)
  [EpubSettingProperties.COLUMN_GAP_IN_PERCENT]: 5,  // % (1% ~ 20%)
  [EpubSettingProperties.CONTAINER_HORIZONTAL_MARGIN]: 30,
  [EpubSettingProperties.CONTAINER_VERTICAL_MARGIN]: 35,
  // contentWidthInPercent: 100,  // % (50% ~ 100%)
};

export const EpubSettingReducer: Reducer<EpubSettingState, EpubSettingAction> = (state, action) => {
  switch(action.type) {
    case EpubSettingActionType.UPDATE_SETTING:
      return { ...state, ...action.setting };
    default:
      return state;
  }
};

export const {
  DispatchContext: EpubSettingDispatchContext,
  StateContext: EpubSettingContext,
  ContextProvider: EpubSettingContextProvider,
} = generateContext(EpubSettingReducer, initialEpubSettingState, 'EpubSetting');

import {Reducer} from "react";
import { generateContext } from "./ContextProvider";

export enum ViewType {
  SCROLL, PAGE1, PAGE12, PAGE23,
}

export enum SettingActionType {
  UPDATE_SETTING,
}

export type SettingAction = { type: SettingActionType.UPDATE_SETTING, setting: Partial<SettingState> };

export type SettingState = {
  viewType: ViewType,
  // binding
  fontSizeInEm: number,
  lineHeightInEm: number,
  contentPaddingInPercent: number,
  columnGapInPercent: number,
  maxWidth: number,
  containerHorizontalMargin: number,
  containerVerticalMargin: number,
};

export const initialSettingState: SettingState = {
  viewType: ViewType.SCROLL,
  fontSizeInEm: 1,        // em (0.1em ~ 5.0em)
  lineHeightInEm: 1.67,   // em (1.0 ~ 3.0)
  contentPaddingInPercent: 12, // % (0 ~ 25%)
  columnGapInPercent: 5,  // % (1% ~ 20%)
  maxWidth: 700,
  containerHorizontalMargin: 30,
  containerVerticalMargin: 35,
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

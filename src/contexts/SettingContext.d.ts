import { Reducer } from "react";
export declare enum ViewType {
    SCROLL = 0,
    PAGE1 = 1,
    PAGE12 = 2,
    PAGE23 = 3
}
export declare enum SettingActionType {
    UPDATE_SETTING = 0
}
export declare type SettingAction = {
    type: SettingActionType.UPDATE_SETTING;
    setting: Partial<SettingState>;
};
export declare type SettingState = {
    viewType: ViewType;
    fontSizeInEm: number;
    lineHeightInEm: number;
    contentPaddingInPercent: number;
    columnGapInPercent: number;
    maxWidth: number;
    containerHorizontalMargin: number;
    containerVerticalMargin: number;
};
export declare const initialSettingState: SettingState;
export declare const settingReducer: Reducer<SettingState, SettingAction>;
export declare const SettingDispatchContext: import("react").Context<import("react").Dispatch<SettingAction>>, SettingContext: import("react").Context<SettingState>, SettingContextProvider: import("react").FunctionComponent<{
    children: import("react").ReactNode;
    customInitialState?: Partial<SettingState> | undefined;
}>;

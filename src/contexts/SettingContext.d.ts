import { Reducer } from "react";
export declare enum ViewType {
    SCROLL = "scroll",
    PAGE1 = "page1",
    PAGE12 = "page12",
    PAGE23 = "page23"
}
export declare enum SettingActionType {
    UPDATE_SETTING = "update_setting"
}
export declare enum SettingProperties {
    VIEW_TYPE = "viewType",
    FONT = "font",
    FONT_SIZE_IN_EM = "fontSizeInEm",
    LINE_HEIGHT_IN_EM = "lineHeightInEm",
    CONTENT_PADDING_IN_PERCENT = "contentPaddingInPercent",
    COLUMN_GAP_IN_PERCENT = "columnGapInPercent",
    MAX_WIDTH = "maxWidth",
    CONTAINER_HORIZONTAL_MARGIN = "containerHorizontalMargin",
    CONTAINER_VERTICAL_MARGIN = "containerVerticalMargin"
}
export declare type SettingAction = {
    type: SettingActionType.UPDATE_SETTING;
    setting: Partial<SettingState>;
};
export declare type SettingState = {
    [SettingProperties.VIEW_TYPE]: ViewType;
    [SettingProperties.FONT]: string;
    [SettingProperties.FONT_SIZE_IN_EM]: number;
    [SettingProperties.LINE_HEIGHT_IN_EM]: number;
    [SettingProperties.CONTENT_PADDING_IN_PERCENT]: number;
    [SettingProperties.COLUMN_GAP_IN_PERCENT]: number;
    [SettingProperties.MAX_WIDTH]: number;
    [SettingProperties.CONTAINER_HORIZONTAL_MARGIN]: number;
    [SettingProperties.CONTAINER_VERTICAL_MARGIN]: number;
};
export declare const initialSettingState: SettingState;
export declare const settingReducer: Reducer<SettingState, SettingAction>;
export declare const SettingDispatchContext: import("react").Context<import("react").Dispatch<SettingAction>>, SettingContext: import("react").Context<SettingState>, SettingContextProvider: import("react").FunctionComponent<{
    children: import("react").ReactNode;
    customInitialState?: Partial<SettingState> | undefined;
}>;

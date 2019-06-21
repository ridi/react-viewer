import { Reducer } from 'react';
import { ViewType } from '../../constants';
export declare enum EpubSettingActionType {
    UPDATE_SETTING = "update_setting"
}
export declare enum EpubSettingProperties {
    VIEW_TYPE = "viewType",
    FONT = "font",
    FONT_SIZE_IN_EM = "fontSizeInEm",
    LINE_HEIGHT_IN_EM = "lineHeightInEm",
    CONTENT_PADDING_IN_PERCENT = "contentPaddingInPercent",
    COLUMN_GAP_IN_PERCENT = "columnGapInPercent",
    CONTAINER_HORIZONTAL_MARGIN = "containerHorizontalMargin",
    CONTAINER_VERTICAL_MARGIN = "containerVerticalMargin"
}
export declare type EpubSettingAction = {
    type: EpubSettingActionType.UPDATE_SETTING;
    setting: Partial<EpubSettingState>;
};
export declare type EpubSettingState = {
    [EpubSettingProperties.VIEW_TYPE]: ViewType;
    [EpubSettingProperties.FONT]: string;
    [EpubSettingProperties.FONT_SIZE_IN_EM]: number;
    [EpubSettingProperties.LINE_HEIGHT_IN_EM]: number;
    [EpubSettingProperties.CONTENT_PADDING_IN_PERCENT]: number;
    [EpubSettingProperties.COLUMN_GAP_IN_PERCENT]: number;
    [EpubSettingProperties.CONTAINER_HORIZONTAL_MARGIN]: number;
    [EpubSettingProperties.CONTAINER_VERTICAL_MARGIN]: number;
};
export declare const initialEpubSettingState: EpubSettingState;
export declare const EpubSettingReducer: Reducer<EpubSettingState, EpubSettingAction>;
export declare const EpubSettingDispatchContext: import("react").Context<import("react").Dispatch<EpubSettingAction>>, EpubSettingContext: import("react").Context<EpubSettingState>, EpubSettingContextProvider: import("react").FunctionComponent<{
    children: import("react").ReactNode;
    customInitialState?: Partial<EpubSettingState> | undefined;
}>;

import { Reducer } from "react";
import { ViewType, BindingType } from '../../constants';
export declare enum ComicSettingActionType {
    UPDATE_SETTING = "update_setting"
}
export declare enum ComicSettingProperties {
    VIEW_TYPE = "viewType",
    CONTENT_WIDTH_IN_PERCENT = "contentWidthInPercent",
    BINDING_TYPE = "bindingType",
    LAZY_LOAD = "lazyLoad"
}
export declare type ComicSettingAction = {
    type: ComicSettingActionType.UPDATE_SETTING;
    setting: Partial<ComicSettingState>;
};
export declare type ComicSettingState = {
    [ComicSettingProperties.VIEW_TYPE]: ViewType;
    [ComicSettingProperties.CONTENT_WIDTH_IN_PERCENT]: number;
    [ComicSettingProperties.BINDING_TYPE]: BindingType;
    [ComicSettingProperties.LAZY_LOAD]: boolean | number;
};
export declare const initialComicSettingState: ComicSettingState;
export declare const ComicSettingReducer: Reducer<ComicSettingState, ComicSettingAction>;
export declare const ComicSettingDispatchContext: import("react").Context<import("react").Dispatch<ComicSettingAction>>, ComicSettingContext: import("react").Context<ComicSettingState>, ComicSettingContextProvider: import("react").FunctionComponent<{
    children: import("react").ReactNode;
    customInitialState?: Partial<ComicSettingState> | undefined;
}>;

import { SettingState } from "./contexts";
export declare const isScroll: ({ viewType }: SettingState) => boolean;
export declare const columnsInPage: ({ viewType }: SettingState) => number;
export declare const columnGap: ({ columnGapInPercent }: SettingState) => number;
export declare const containerWidth: ({ containerHorizontalMargin, contentPaddingInPercent }: SettingState) => number;
export declare const containerHeight: ({ containerVerticalMargin }: SettingState) => number;

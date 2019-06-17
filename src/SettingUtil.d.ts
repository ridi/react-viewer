import { SettingState } from './contexts';
export declare const isScroll: ({ viewType }: SettingState) => boolean;
export declare const isDoublePage: ({ viewType }: SettingState) => boolean;
export declare const columnsInPage: ({ viewType }: SettingState) => number;
export declare const columnWidth: (setting: SettingState) => number;
export declare const columnGap: ({ columnGapInPercent }: SettingState) => number;
export declare const contentPadding: ({ contentPaddingInPercent }: SettingState) => number;
export declare const containerWidth: (setting: SettingState) => number;
export declare const containerHeight: ({ containerVerticalMargin }: SettingState) => number;

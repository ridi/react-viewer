import { EpubSettingState } from './contexts';
export declare const isScroll: ({ viewType }: EpubSettingState) => boolean;
export declare const isDoublePage: ({ viewType }: EpubSettingState) => boolean;
export declare const columnsInPage: ({ viewType }: EpubSettingState) => number;
export declare const columnWidth: (setting: EpubSettingState) => number;
export declare const columnGap: ({ columnGapInPercent }: EpubSettingState) => number;
export declare const contentPadding: ({ contentPaddingInPercent }: EpubSettingState) => number;
export declare const containerWidth: (setting: EpubSettingState) => number;
export declare const containerHeight: ({ containerVerticalMargin }: EpubSettingState) => number;

import { ComicSettingState } from '../contexts/index';
export declare const isScroll: ({ viewType }: ComicSettingState) => boolean;
export declare const isDoublePage: ({ viewType }: ComicSettingState) => boolean;
export declare const columnsInPage: ({ viewType }: ComicSettingState) => number;
export declare const contentWidth: ({ contentWidthInPercent }: ComicSettingState) => number;

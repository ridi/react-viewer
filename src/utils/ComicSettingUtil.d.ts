import { ComicCalculationState, ComicSettingState } from '../contexts';
export declare const isScroll: ({ viewType }: ComicSettingState) => boolean;
export declare const isDoublePage: ({ viewType }: ComicSettingState) => boolean;
export declare const columnsInPage: ({ viewType }: ComicSettingState) => number;
export declare const contentWidth: (setting: ComicSettingState) => number;
export declare const ratio: (width?: number | undefined, height?: number | undefined) => number;
export declare const containerWidth: (setting: ComicSettingState, calculation: ComicCalculationState) => number;
export declare const objectPosition: (setting: ComicSettingState, imageIndex: number) => "50% 50%" | "right 50%" | "left 50%";

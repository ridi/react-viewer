import { EpubPagingAction, EpubSettingAction, EpubSettingState, SpinePagingState, EpubStatusAction } from './contexts';
import * as React from 'react';
export interface FontData {
    href: string;
}
export interface EpubParsedData {
    fonts?: Array<FontData>;
    styles?: Array<String>;
    spines?: Array<String>;
    unzipPath: string;
}
export declare class EpubService {
    static dispatchSetting?: React.Dispatch<EpubSettingAction>;
    static dispatchStatus?: React.Dispatch<EpubStatusAction>;
    static dispatchPaging?: React.Dispatch<EpubPagingAction>;
    static init({ dispatchSetting, dispatchPaging, dispatchStatus }: {
        dispatchSetting: React.Dispatch<EpubSettingAction>;
        dispatchStatus: React.Dispatch<EpubStatusAction>;
        dispatchPaging: React.Dispatch<EpubPagingAction>;
    }): void;
    private static setReadyToRead;
    private static inLoadingState;
    private static appendStyles;
    private static waitImagesLoaded;
    private static prepareFonts;
    private static startPaging;
    private static getPageFromSpineIndexAndPosition;
    /**
     * Restore page from spineIndex and position
     * @param currentSpineIndex
     * @param currentPosition
     * @param spines
     * @param pageUnit
     * @param isScroll
     */
    private static restoreCurrent;
    static goToPage: ({ page, pageUnit, isScroll, }: {
        page: number;
        pageUnit: number;
        isScroll: boolean;
    }) => Promise<void>;
    static invalidate: ({ currentSpineIndex, currentPosition, isScroll, columnWidth, columnGap, }: {
        currentSpineIndex: number;
        currentPosition: number;
        isScroll: boolean;
        columnWidth: number;
        columnGap: number;
    }) => Promise<void>;
    static load: ({ currentSpineIndex, currentPosition, metadata, isScroll, columnWidth, columnGap, }: {
        currentSpineIndex: number;
        currentPosition: number;
        metadata: EpubParsedData;
        isScroll: boolean;
        columnWidth: number;
        columnGap: number;
    }) => Promise<void>;
    static loadWithParsedData: ({ currentSpineIndex, currentPosition, metadata, isScroll, columnWidth, columnGap, }: {
        currentSpineIndex: number;
        currentPosition: number;
        metadata: EpubParsedData;
        isScroll: boolean;
        columnWidth: number;
        columnGap: number;
    }) => Promise<void>;
    static updateCurrent: ({ pageUnit, isScroll, spines, }: {
        pageUnit: number;
        isScroll: boolean;
        spines: SpinePagingState[];
    }) => Promise<any>;
    static updateSetting: (setting: Partial<EpubSettingState>) => Promise<void>;
}

import { PagingAction, SettingAction, SettingState, StatusAction } from './contexts';
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
    static dispatchSetting?: React.Dispatch<SettingAction>;
    static dispatchStatus?: React.Dispatch<StatusAction>;
    static dispatchPaging?: React.Dispatch<PagingAction>;
    static init({ dispatchSetting, dispatchPaging, dispatchStatus }: {
        dispatchSetting: React.Dispatch<SettingAction>;
        dispatchStatus: React.Dispatch<StatusAction>;
        dispatchPaging: React.Dispatch<PagingAction>;
    }): void;
    private static setStartToRead;
    private static inLoadingState;
    private static appendStyles;
    private static waitImagesLoaded;
    private static prepareFonts;
    private static startPaging;
    private static restoreCurrent;
    static goToPage: ({ page, pageUnit, isScroll, columnsInPage, }: {
        page: number;
        pageUnit: number;
        isScroll: boolean;
        columnsInPage: number;
    }) => Promise<void>;
    static invalidate: ({ currentPage, isScroll, columnWidth, columnGap, columnsInPage, }: {
        currentPage: number;
        isScroll: boolean;
        columnWidth: number;
        columnGap: number;
        columnsInPage: number;
    }) => Promise<void>;
    static load: ({ metadata, currentPage, isScroll, columnWidth, columnGap, columnsInPage, }: {
        metadata: EpubParsedData;
        currentPage: number;
        isScroll: boolean;
        columnWidth: number;
        columnGap: number;
        columnsInPage: number;
    }) => Promise<void>;
    static loadWithParsedData: ({ metadata, currentPage, isScroll, columnWidth, columnGap, columnsInPage, }: {
        metadata: EpubParsedData;
        currentPage: number;
        isScroll: boolean;
        columnWidth: number;
        columnGap: number;
        columnsInPage: number;
    }) => Promise<void>;
    static updateCurrent: ({ pageUnit, isScroll, columnsInPage }: {
        pageUnit: number;
        isScroll: boolean;
        columnsInPage: number;
    }) => Promise<any>;
    static updateSetting: (setting: Partial<SettingState>) => void;
}

import { PagingAction, SettingAction, StatusAction } from "./contexts";
import * as React from "react";
interface FontData {
    href: string;
}
interface EpubParsedData {
    fonts?: Array<FontData>;
    styles?: Array<String>;
    spines?: Array<String>;
    unzipPath: string;
}
export default class EpubService {
    static dispatchSetting?: React.Dispatch<SettingAction>;
    static dispatchStatus?: React.Dispatch<StatusAction>;
    static dispatchPaging?: React.Dispatch<PagingAction>;
    static init(dispatchSetting: React.Dispatch<SettingAction>, dispatchStatus: React.Dispatch<StatusAction>, dispatchPaging: React.Dispatch<PagingAction>): void;
    private static setStartToRead;
    private static inLoadingState;
    private static appendStyles;
    private static waitImagesLoaded;
    private static prepareFonts;
    private static startPaging;
    static goToPage: (page: number, pageUnit: number, isScroll: boolean, columnsInPage: number) => Promise<void>;
    private static restoreCurrent;
    static invalidate: (currentPage: number, isScroll: boolean, columnGap: number, columnsInPage: number) => Promise<void>;
    private static parseBook;
    static load: (file: File, currentPage: number, isScroll: boolean, columnGap: number, columnsInPage: number) => Promise<void>;
    static loadWithParsedData: (metadata: EpubParsedData, currentPage: number, isScroll: boolean, columnGap: number, columnsInPage: number) => Promise<void>;
    static updateCurrent: (pageUnit: number, isScroll: boolean, columnsInPage: number) => Promise<any>;
}
export {};

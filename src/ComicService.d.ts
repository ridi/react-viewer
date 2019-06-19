import * as React from 'react';
import { ComicPagingAction, ComicPagingState, ComicSettingAction, ComicSettingState, ComicStatusAction } from './contexts';
export interface ImageData {
    fileSize: number;
    index: number;
    path: string;
    width?: number;
    height?: number;
}
export interface ComicParsedData {
    type: 'comic';
    images?: Array<ImageData>;
    unzipPath: string;
}
export declare class ComicService {
    static dispatchSetting?: React.Dispatch<ComicSettingAction>;
    static dispatchStatus?: React.Dispatch<ComicStatusAction>;
    static dispatchPaging?: React.Dispatch<ComicPagingAction>;
    private static setReadyToRead;
    private static restoreCurrent;
    private static startPaging;
    static init: ({ dispatchSetting, dispatchPaging, dispatchStatus }: {
        dispatchSetting: React.Dispatch<ComicSettingAction>;
        dispatchStatus: React.Dispatch<ComicStatusAction>;
        dispatchPaging: React.Dispatch<ComicPagingAction>;
    }) => void;
    static invalidate: ({ pagingState, settingState, }: {
        pagingState: ComicPagingState;
        settingState: ComicSettingState;
    }) => Promise<void>;
    static load: ({ metadata, pagingState, settingState, }: {
        metadata: ComicParsedData;
        pagingState: ComicPagingState;
        settingState: ComicSettingState;
    }) => Promise<void>;
    static goToPage: ({ page, settingState, pagingState, }: {
        page: number;
        settingState: ComicSettingState;
        pagingState: ComicPagingState;
    }) => Promise<void>;
    static updateSetting: (setting: Partial<ComicSettingState>) => Promise<void>;
}

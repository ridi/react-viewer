import * as React from 'react';
import { ComicCalculationAction, ComicCalculationState, ComicSettingAction, ComicSettingState, ComicStatusAction } from './contexts';
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
    static dispatchPaging?: React.Dispatch<ComicCalculationAction>;
    private static setReadyToRead;
    private static restoreCurrent;
    private static startPaging;
    static init: ({ dispatchSetting, dispatchPaging, dispatchStatus }: {
        dispatchSetting: React.Dispatch<ComicSettingAction>;
        dispatchStatus: React.Dispatch<ComicStatusAction>;
        dispatchPaging: React.Dispatch<ComicCalculationAction>;
    }) => void;
    static invalidate: ({ pagingState, settingState, }: {
        pagingState: ComicCalculationState;
        settingState: ComicSettingState;
    }) => Promise<void>;
    static load: ({ metadata, pagingState, settingState, }: {
        metadata: ComicParsedData;
        pagingState: ComicCalculationState;
        settingState: ComicSettingState;
    }) => Promise<void>;
    static goToPage: ({ page, settingState, pagingState, }: {
        page: number;
        settingState: ComicSettingState;
        pagingState: ComicCalculationState;
    }) => Promise<void>;
    static updateSetting: (setting: Partial<ComicSettingState>) => Promise<void>;
}

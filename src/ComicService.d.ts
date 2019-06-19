import * as React from 'react';
import { ComicCalculationAction, ComicCalculationState, ComicCurrentAction, ComicCurrentState, ComicSettingAction, ComicSettingState, ComicStatusAction, ComicStatusState } from './contexts';
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
interface ComicServiceProperties {
    dispatchSetting: React.Dispatch<ComicSettingAction>;
    dispatchStatus: React.Dispatch<ComicStatusAction>;
    dispatchCalculation: React.Dispatch<ComicCalculationAction>;
    dispatchCurrent: React.Dispatch<ComicCurrentAction>;
    settingState: ComicSettingState;
    statusState: ComicStatusState;
    currentState: ComicCurrentState;
    calculationState: ComicCalculationState;
}
export declare class ComicService {
    private static instance;
    dispatchSetting: React.Dispatch<ComicSettingAction>;
    dispatchStatus: React.Dispatch<ComicStatusAction>;
    dispatchCalculation: React.Dispatch<ComicCalculationAction>;
    dispatchCurrent: React.Dispatch<ComicCurrentAction>;
    settingState: ComicSettingState;
    currentState: ComicCurrentState;
    statusState: ComicStatusState;
    calculationState: ComicCalculationState;
    static init(props: ComicServiceProperties): void;
    static get(): ComicService;
    static updateState({ settingState, currentState, statusState, calculationState, }: {
        settingState: ComicSettingState;
        statusState: ComicStatusState;
        currentState: ComicCurrentState;
        calculationState: ComicCalculationState;
    }): void;
    private constructor();
    private setReadyToRead;
    private restoreCurrent;
    private calculate;
    invalidate: () => Promise<void>;
    load: (metadata: ComicParsedData) => Promise<void>;
    goToPage: (page: number) => Promise<void>;
    updateSetting: (setting: Partial<ComicSettingState>) => Promise<void>;
    updateCurrent: () => Promise<void>;
}
export {};

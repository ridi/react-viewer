import { EpubCalculationAction, EpubCalculationState, EpubCurrentAction, EpubCurrentState, EpubSettingAction, EpubSettingState, EpubStatusAction } from './contexts';
import * as React from 'react';
export interface FontData {
    href: string;
    uri?: string;
}
export interface EpubParsedData {
    type: 'epub';
    fonts?: Array<FontData>;
    styles?: Array<String>;
    spines?: Array<String>;
    unzipPath: string;
}
interface EpubServiceProperties {
    dispatchSetting: React.Dispatch<EpubSettingAction>;
    dispatchStatus: React.Dispatch<EpubStatusAction>;
    dispatchCalculation: React.Dispatch<EpubCalculationAction>;
    dispatchCurrent: React.Dispatch<EpubCurrentAction>;
    settingState: EpubSettingState;
    currentState: EpubCurrentState;
    calculationState: EpubCalculationState;
}
export declare class EpubService {
    private static instance;
    private readonly dispatchSetting;
    private readonly dispatchStatus;
    private readonly dispatchCalculation;
    private readonly dispatchCurrent;
    private settingState;
    private currentState;
    private calculationState;
    static init(props: EpubServiceProperties): void;
    static get(): EpubService;
    static updateState({ settingState, currentState, calculationState, }: {
        settingState: EpubSettingState;
        currentState: EpubCurrentState;
        calculationState: EpubCalculationState;
    }): void;
    private constructor();
    private setReadyToRead;
    private appendStyles;
    private waitImagesLoaded;
    private prepareFonts;
    private calculate;
    private getPageFromSpineIndexAndPosition;
    private restoreCurrent;
    goToPage: (requestPage: number) => Promise<void>;
    invalidate: () => Promise<void>;
    load: (metadata: EpubParsedData) => Promise<void>;
    updateCurrent: () => Promise<any>;
    updateSetting: (setting: Partial<EpubSettingState>) => Promise<void>;
}
export {};

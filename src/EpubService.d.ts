import { EpubCalculationAction, EpubCalculationState, EpubCurrentAction, EpubCurrentState, EpubSettingAction, EpubSettingState } from './contexts';
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
    dispatchCalculation: React.Dispatch<EpubCalculationAction>;
    dispatchCurrent: React.Dispatch<EpubCurrentAction>;
    settingState: EpubSettingState;
    currentState: EpubCurrentState;
    calculationState: EpubCalculationState;
}
export declare class EpubService {
    private static instance?;
    private readonly dispatchSetting;
    private readonly dispatchCalculation;
    private readonly dispatchCurrent;
    private settingState;
    private currentState;
    private calculationState;
    private isLoaded;
    static init(props: EpubServiceProperties): void;
    static destroy(): void;
    static isInitialized(): boolean;
    static get(): EpubService;
    static updateState({ settingState, currentState, calculationState, }: {
        settingState: EpubSettingState;
        currentState: EpubCurrentState;
        calculationState: EpubCalculationState;
    }): void;
    private constructor();
    private setCalculation;
    private setSetting;
    private setCurrent;
    private setReadyToRead;
    private appendStyles;
    private waitImagesLoaded;
    private prepareFonts;
    private calculate;
    private getPageFromSpineIndexAndPosition;
    private restoreCurrent;
    goToPage: (requestPage: number) => void;
    invalidate: () => void;
    load: (metadata: EpubParsedData) => void;
    private getCurrentFromScrollPosition;
    updateCurrent: () => void;
    updateSetting: (setting: Partial<EpubSettingState>) => void;
}
export {};

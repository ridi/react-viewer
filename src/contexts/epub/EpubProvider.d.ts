import { EpubCalculationState } from './EpubCalculationContext';
import { EpubSettingState } from './EpubSettingContext';
import { EpubCurrentState } from './EpubCurrentContext';
import * as React from 'react';
export interface EpubProviderProps {
    children: React.ReactNode;
    settingState?: Partial<EpubSettingState>;
    calculationState?: Partial<EpubCalculationState>;
    currentState?: Partial<EpubCurrentState>;
}
export declare const EpubProvider: React.FunctionComponent<EpubProviderProps>;

import { EpubCalculationState } from './EpubCalculationContext';
import { EpubStatusState } from './EpubStatusContext';
import { EpubSettingState } from './EpubSettingContext';
import * as React from 'react';
export interface EpubProviderProps {
    children: React.ReactNode;
    settingState?: Partial<EpubSettingState>;
    pagingState?: Partial<EpubCalculationState>;
    statusState?: Partial<EpubStatusState>;
}
export declare const EpubProvider: React.FunctionComponent<EpubProviderProps>;

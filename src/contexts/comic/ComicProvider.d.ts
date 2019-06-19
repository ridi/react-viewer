import { ComicCalculationState } from './ComicCalculationContext';
import { ComicStatusState } from './ComicStatusContext';
import { ComicSettingState } from './ComicSettingContext';
import { ComicCurrentState } from './ComicCurrentContext';
import * as React from 'react';
export interface ComicProviderProps {
    children: React.ReactNode;
    settingState?: Partial<ComicSettingState>;
    calculationState?: Partial<ComicCalculationState>;
    statusState?: Partial<ComicStatusState>;
    currentState?: Partial<ComicCurrentState>;
}
export declare const ComicProvider: React.FunctionComponent<ComicProviderProps>;

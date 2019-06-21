import { ComicCalculationState } from './ComicCalculationContext';
import { ComicSettingState } from './ComicSettingContext';
import { ComicCurrentState } from './ComicCurrentContext';
import * as React from 'react';
export interface ComicProviderProps {
    children: React.ReactNode;
    settingState?: Partial<ComicSettingState>;
    calculationState?: Partial<ComicCalculationState>;
    currentState?: Partial<ComicCurrentState>;
}
export declare const ComicProvider: React.FunctionComponent<ComicProviderProps>;

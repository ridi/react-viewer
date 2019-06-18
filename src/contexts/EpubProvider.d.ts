import { PagingState } from './PagingContext';
import { StatusState } from './StatusContext';
import { SettingState } from './SettingContext';
import * as React from 'react';
export interface EpubProviderProps {
    children: React.ReactNode;
    settingState?: Partial<SettingState>;
    pagingState?: Partial<PagingState>;
    statusState?: Partial<StatusState>;
}
export declare const EpubProvider: React.FunctionComponent<EpubProviderProps>;

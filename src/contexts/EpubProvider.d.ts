import { PagingState } from './PagingContext';
import { StatusState } from './StatusContext';
import { SettingState } from './SettingContext';
import * as React from 'react';
export interface EpubProviderProps {
    children: React.ReactNode;
    settingState?: SettingState;
    pagingState?: PagingState;
    statusState?: StatusState;
}
export declare const EpubProvider: React.FunctionComponent<EpubProviderProps>;

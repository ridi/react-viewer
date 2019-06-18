import { EpubPagingState } from './EpubPagingContext';
import { StatusState } from './EpubStatusContext';
import { EpubSettingState } from './EpubSettingContext';
import * as React from 'react';
export interface EpubProviderProps {
    children: React.ReactNode;
    settingState?: Partial<EpubSettingState>;
    pagingState?: Partial<EpubPagingState>;
    statusState?: Partial<StatusState>;
}
export declare const EpubProvider: React.FunctionComponent<EpubProviderProps>;

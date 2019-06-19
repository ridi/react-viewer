import { ComicPagingState } from './ComicPagingContext';
import { ComicStatusState } from './ComicStatusContext';
import { ComicSettingState } from './ComicSettingContext';
import * as React from 'react';
export interface ComicProviderProps {
    children: React.ReactNode;
    settingState?: Partial<ComicSettingState>;
    pagingState?: Partial<ComicPagingState>;
    statusState?: Partial<ComicStatusState>;
}
export declare const ComicProvider: React.FunctionComponent<ComicProviderProps>;

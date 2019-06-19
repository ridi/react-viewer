import { ComicPagingContextProvider, ComicPagingDispatchContext, ComicPagingState } from './ComicPagingContext';
import { ComicStatusContextProvider, ComicStatusDispatchContext, ComicStatusState } from './ComicStatusContext';
import { ComicSettingContextProvider, ComicSettingDispatchContext, ComicSettingState } from './ComicSettingContext';
import * as React from 'react';
import { ComicService } from '../ComicService';

const ComicContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(ComicSettingDispatchContext);
  const dispatchStatus = React.useContext(ComicStatusDispatchContext);
  const dispatchPaging = React.useContext(ComicPagingDispatchContext);

  ComicService.init({ dispatchSetting, dispatchStatus, dispatchPaging });

  return <>{children}</>;
};

export interface ComicProviderProps {
  children: React.ReactNode,
  settingState ?: Partial<ComicSettingState>,
  pagingState?: Partial<ComicPagingState>,
  statusState?: Partial<ComicStatusState>,
}

export const ComicProvider: React.FunctionComponent<ComicProviderProps> = ({ children, settingState, pagingState, statusState }: ComicProviderProps) => {
  return (
    <ComicSettingContextProvider customInitialState={settingState}>
      <ComicPagingContextProvider customInitialState={pagingState}>
        <ComicStatusContextProvider customInitialState={statusState}>
          <ComicContextInitializer>
            { children }
          </ComicContextInitializer>
        </ComicStatusContextProvider>
      </ComicPagingContextProvider>
    </ComicSettingContextProvider>
  );
};

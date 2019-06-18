import { EpubPagingContextProvider, EpubPagingDispatchContext, EpubPagingState } from './EpubPagingContext';
import { EpubStatusContextProvider, EpubStatusDispatchContext, StatusState } from './EpubStatusContext';
import { EpubSettingContextProvider, EpubSettingDispatchContext, EpubSettingState } from './EpubSettingContext';
import * as React from 'react';
import { EpubService } from '../EpubService';

const EpubContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(EpubSettingDispatchContext);
  const dispatchStatus = React.useContext(EpubStatusDispatchContext);
  const dispatchPaging = React.useContext(EpubPagingDispatchContext);

  EpubService.init({ dispatchSetting, dispatchStatus, dispatchPaging });

  return <>{children}</>;
};

export interface EpubProviderProps {
  children: React.ReactNode,
  settingState ?: Partial<EpubSettingState>,
  pagingState?: Partial<EpubPagingState>,
  statusState?: Partial<StatusState>,
}

export const EpubProvider: React.FunctionComponent<EpubProviderProps> = ({ children, settingState, pagingState, statusState }: EpubProviderProps) => {
  return (
    <EpubSettingContextProvider customInitialState={settingState}>
      <EpubPagingContextProvider customInitialState={pagingState}>
        <EpubStatusContextProvider customInitialState={statusState}>
          <EpubContextInitializer>
            { children }
          </EpubContextInitializer>
        </EpubStatusContextProvider>
      </EpubPagingContextProvider>
    </EpubSettingContextProvider>
  );
};

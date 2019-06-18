import { PagingContextProvider, PagingDispatchContext, PagingState } from './PagingContext';
import { StatusContextProvider, StatusDispatchContext, StatusState } from './StatusContext';
import { SettingContextProvider, SettingDispatchContext, SettingState } from './SettingContext';
import * as React from 'react';
import { EpubService } from '../EpubService';

const EpubContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(SettingDispatchContext);
  const dispatchStatus = React.useContext(StatusDispatchContext);
  const dispatchPaging = React.useContext(PagingDispatchContext);

  EpubService.init({ dispatchSetting, dispatchStatus, dispatchPaging });

  return <>{children}</>;
};

export interface EpubProviderProps {
  children: React.ReactNode,
  settingState ?: Partial<SettingState>,
  pagingState?: Partial<PagingState>,
  statusState?: Partial<StatusState>,
}

export const EpubProvider: React.FunctionComponent<EpubProviderProps> = ({ children, settingState, pagingState, statusState }: EpubProviderProps) => {
  return (
    <SettingContextProvider customInitialState={settingState}>
      <PagingContextProvider customInitialState={pagingState}>
        <StatusContextProvider customInitialState={statusState}>
          <EpubContextInitializer>
            { children }
          </EpubContextInitializer>
        </StatusContextProvider>
      </PagingContextProvider>
    </SettingContextProvider>
  );
};

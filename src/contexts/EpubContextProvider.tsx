import {PagingContextProvider, PagingDispatchContext} from './PagingContext';
import {StatusContextProvider, StatusDispatchContext} from './StatusContext';
import {SettingContextProvider, SettingDispatchContext} from './SettingContext';
import * as React from 'react';
import { EpubService } from '../EpubService';

const EpubContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(SettingDispatchContext);
  const dispatchStatus = React.useContext(StatusDispatchContext);
  const dispatchPaging = React.useContext(PagingDispatchContext);

  EpubService.init({ dispatchSetting, dispatchStatus, dispatchPaging });

  return <>{children}</>;
};

export const EpubContextProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingContextProvider>
      <PagingContextProvider>
        <StatusContextProvider>
          <EpubContextInitializer>
            { children }
          </EpubContextInitializer>
        </StatusContextProvider>
      </PagingContextProvider>
    </SettingContextProvider>
  );
};

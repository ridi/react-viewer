import { EpubCalculationContextProvider, EpubCalculationDispatchContext, EpubCalculationState } from './EpubCalculationContext';
import { EpubStatusContextProvider, EpubStatusDispatchContext, EpubStatusState } from './EpubStatusContext';
import { EpubSettingContextProvider, EpubSettingDispatchContext, EpubSettingState } from './EpubSettingContext';
import * as React from 'react';
import { EpubService } from '../../EpubService';

const EpubContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(EpubSettingDispatchContext);
  const dispatchStatus = React.useContext(EpubStatusDispatchContext);
  const dispatchPaging = React.useContext(EpubCalculationDispatchContext);

  EpubService.init({ dispatchSetting, dispatchStatus, dispatchPaging });

  return <>{children}</>;
};

export interface EpubProviderProps {
  children: React.ReactNode,
  settingState?: Partial<EpubSettingState>,
  pagingState?: Partial<EpubCalculationState>,
  statusState?: Partial<EpubStatusState>,
}

export const EpubProvider: React.FunctionComponent<EpubProviderProps> = ({ children, settingState, pagingState, statusState }: EpubProviderProps) => {
  return (
    <EpubSettingContextProvider customInitialState={settingState}>
      <EpubCalculationContextProvider customInitialState={pagingState}>
        <EpubStatusContextProvider customInitialState={statusState}>
          <EpubContextInitializer>
            {children}
          </EpubContextInitializer>
        </EpubStatusContextProvider>
      </EpubCalculationContextProvider>
    </EpubSettingContextProvider>
  );
};

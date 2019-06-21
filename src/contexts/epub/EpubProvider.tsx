import {
  EpubCalculationContext,
  EpubCalculationContextProvider,
  EpubCalculationDispatchContext,
  EpubCalculationState,
} from './EpubCalculationContext';
import {
  EpubStatusContextProvider,
  EpubStatusDispatchContext,
  EpubStatusState,
} from './EpubStatusContext';
import {
  EpubSettingContext,
  EpubSettingContextProvider,
  EpubSettingDispatchContext,
  EpubSettingState,
} from './EpubSettingContext';
import {
  EpubCurrentContext,
  EpubCurrentContextProvider,
  EpubCurrentDispatchContext,
  EpubCurrentState,
} from './EpubCurrentContext';
import * as React from 'react';
import { EpubService } from '../../EpubService';

const EpubContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(EpubSettingDispatchContext);
  const dispatchStatus = React.useContext(EpubStatusDispatchContext);
  const dispatchCalculation = React.useContext(EpubCalculationDispatchContext);
  const dispatchCurrent = React.useContext(EpubCurrentDispatchContext);

  const settingState = React.useContext(EpubSettingContext);
  const currentState = React.useContext(EpubCurrentContext);
  const calculationState = React.useContext(EpubCalculationContext);

  React.useEffect(() => {
    EpubService.updateState({ settingState, currentState, calculationState });
  }, [settingState, currentState, calculationState]);

  EpubService.init({
    dispatchSetting,
    dispatchStatus,
    dispatchCalculation,
    dispatchCurrent,
    settingState,
    currentState,
    calculationState,
  });

  return <>{children}</>;
};

export interface EpubProviderProps {
  children: React.ReactNode,
  settingState?: Partial<EpubSettingState>,
  calculationState?: Partial<EpubCalculationState>,
  statusState?: Partial<EpubStatusState>,
  currentState?: Partial<EpubCurrentState>,
}

export const EpubProvider: React.FunctionComponent<EpubProviderProps> = ({ children, settingState, calculationState, statusState, currentState }: EpubProviderProps) => {
  return (
    <EpubSettingContextProvider customInitialState={settingState}>
      <EpubCalculationContextProvider customInitialState={calculationState}>
        <EpubCurrentContextProvider customInitialState={currentState}>
          <EpubStatusContextProvider customInitialState={statusState}>
            <EpubContextInitializer>
              {children}
            </EpubContextInitializer>
          </EpubStatusContextProvider>
        </EpubCurrentContextProvider>
      </EpubCalculationContextProvider>
    </EpubSettingContextProvider>
  );
};

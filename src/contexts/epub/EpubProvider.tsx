import {
  EpubCalculationContext,
  EpubCalculationContextProvider,
  EpubCalculationDispatchContext,
  EpubCalculationState,
} from './EpubCalculationContext';
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
import ow from 'ow';
import Validator from '../../validators';

const EpubContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(EpubSettingDispatchContext);
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
  currentState?: Partial<EpubCurrentState>,
}

export const EpubProvider: React.FunctionComponent<EpubProviderProps> = ({ children, settingState, calculationState, currentState }: EpubProviderProps) => {
  ow(settingState, 'EpubProvider.settingState', ow.any(ow.nullOrUndefined, Validator.Epub.SettingState));
  ow(calculationState, 'EpubProvider.calculationState', ow.any(ow.nullOrUndefined, Validator.Epub.CalculationState));
  ow(currentState, 'EpubProvider.currentState', ow.any(ow.nullOrUndefined, Validator.Epub.CurrentState));
  return (
    <EpubSettingContextProvider customInitialState={settingState}>
      <EpubCalculationContextProvider customInitialState={calculationState}>
        <EpubCurrentContextProvider customInitialState={currentState}>
          <EpubContextInitializer>
            {children}
          </EpubContextInitializer>
        </EpubCurrentContextProvider>
      </EpubCalculationContextProvider>
    </EpubSettingContextProvider>
  );
};

import {
  ComicCalculationContext,
  ComicCalculationContextProvider,
  ComicCalculationDispatchContext,
  ComicCalculationState,
} from './ComicCalculationContext';
import {
  ComicSettingContext,
  ComicSettingContextProvider,
  ComicSettingDispatchContext,
  ComicSettingState,
} from './ComicSettingContext';
import {
  ComicCurrentContext,
  ComicCurrentContextProvider,
  ComicCurrentDispatchContext,
  ComicCurrentState,
} from './ComicCurrentContext';
import * as React from 'react';
import { ComicService } from '../../ComicService';
import ow from 'ow';
import Validator from '../../validators';

const ComicContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(ComicSettingDispatchContext);
  const dispatchCalculation = React.useContext(ComicCalculationDispatchContext);
  const dispatchCurrent = React.useContext(ComicCurrentDispatchContext);

  const settingState = React.useContext(ComicSettingContext);
  const currentState = React.useContext(ComicCurrentContext);
  const calculationState = React.useContext(ComicCalculationContext);

  React.useEffect(() => {
    ComicService.updateState({ settingState, currentState, calculationState });
  }, [settingState, currentState, calculationState]);

  ComicService.init({
    dispatchSetting,
    dispatchCalculation,
    dispatchCurrent,
    settingState,
    currentState,
    calculationState,
  });

  return <>{children}</>;
};

export interface ComicProviderProps {
  children: React.ReactNode,
  settingState?: Partial<ComicSettingState>,
  calculationState?: Partial<ComicCalculationState>,
  currentState?: Partial<ComicCurrentState>,
}

export const ComicProvider: React.FunctionComponent<ComicProviderProps> = ({ children, settingState, calculationState, currentState }: ComicProviderProps) => {
  ow(settingState, 'ComicProvider.settingState', ow.any(ow.nullOrUndefined, Validator.Comic.SettingState));
  ow(calculationState, 'ComicProvider.calculationState', ow.any(ow.nullOrUndefined, Validator.Comic.CalculationState));
  ow(currentState, 'ComicProvider.currentState', ow.any(ow.nullOrUndefined, Validator.Comic.CurrentState));
  return (
    <ComicSettingContextProvider customInitialState={settingState}>
      <ComicCalculationContextProvider customInitialState={calculationState}>
        <ComicCurrentContextProvider customInitialState={currentState}>
          <ComicContextInitializer>
            {children}
          </ComicContextInitializer>
        </ComicCurrentContextProvider>
      </ComicCalculationContextProvider>
    </ComicSettingContextProvider>
  );
};

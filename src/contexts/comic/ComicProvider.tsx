import {
  ComicCalculationContext,
  ComicCalculationContextProvider,
  ComicCalculationDispatchContext,
  ComicCalculationState,
} from './ComicCalculationContext';
import {
  ComicStatusContextProvider,
  ComicStatusDispatchContext,
  ComicStatusState,
} from './ComicStatusContext';
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
  const dispatchStatus = React.useContext(ComicStatusDispatchContext);
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
    dispatchStatus,
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
  statusState?: Partial<ComicStatusState>,
  currentState?: Partial<ComicCurrentState>,
}

export const ComicProvider: React.FunctionComponent<ComicProviderProps> = ({ children, settingState, calculationState, statusState, currentState }: ComicProviderProps) => {
  ow(settingState, 'ComicProvider.settingState', ow.any(ow.nullOrUndefined, Validator.Comic.SettingState));
  ow(calculationState, 'ComicProvider.calculationState', ow.any(ow.nullOrUndefined, Validator.Comic.CalculationState));
  ow(currentState, 'ComicProvider.currentState', ow.any(ow.nullOrUndefined, Validator.Comic.CurrentState));
  ow(statusState, 'ComicProvider.statusState', ow.any(ow.nullOrUndefined, Validator.Comic.StatusState));
  return (
    <ComicSettingContextProvider customInitialState={settingState}>
      <ComicCalculationContextProvider customInitialState={calculationState}>
        <ComicCurrentContextProvider customInitialState={currentState}>
          <ComicStatusContextProvider customInitialState={statusState}>
            <ComicContextInitializer>
              {children}
            </ComicContextInitializer>
          </ComicStatusContextProvider>
        </ComicCurrentContextProvider>
      </ComicCalculationContextProvider>
    </ComicSettingContextProvider>
  );
};

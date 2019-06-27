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
import ReaderJsHelper from '../../ReaderJsHelper';
import { Context } from '@ridi/reader.js/web';
import * as SettingUtil from '../../utils/EpubSettingUtil';
import { getClientHeight, getClientWidth } from '../../utils/Util';

const createReaderJsContext = (settingState: EpubSettingState, maxSelectionLength: number = 1000): Context => {
  return Context.build((context) => {
    const isScroll = SettingUtil.isScroll(settingState);
    context.width = isScroll ? getClientWidth() : SettingUtil.columnWidth(settingState);
    context.height = isScroll ? getClientHeight() : SettingUtil.containerHeight(settingState);
    context.gap = isScroll ? 0 : SettingUtil.columnGap(settingState);
    context.isSameDomAsUi = true;
    context.isDoublePageMode = SettingUtil.isDoublePage(settingState);
    context.isScrollMode = SettingUtil.isScroll(settingState);
    context.maxSelectionLength = maxSelectionLength;
  });
};

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

  React.useEffect(() => {
    ReaderJsHelper.updateState({ currentState, settingState, calculationState });
  }, [currentState, settingState, calculationState]);

  React.useEffect(() => {
    ReaderJsHelper.updateContext(createReaderJsContext(settingState));
  }, [calculationState]);

  ReaderJsHelper.init(createReaderJsContext(settingState), { currentState, settingState, calculationState });

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

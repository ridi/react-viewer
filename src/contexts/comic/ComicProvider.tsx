import { ComicCalculationContextProvider, ComicCalculationDispatchContext, ComicCalculationState } from './ComicCalculationContext';
import { ComicStatusContextProvider, ComicStatusDispatchContext, ComicStatusState } from './ComicStatusContext';
import { ComicSettingContextProvider, ComicSettingDispatchContext, ComicSettingState } from './ComicSettingContext';
import * as React from 'react';
import { ComicService } from '../../ComicService';

const ComicContextInitializer: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatchSetting = React.useContext(ComicSettingDispatchContext);
  const dispatchStatus = React.useContext(ComicStatusDispatchContext);
  const dispatchPaging = React.useContext(ComicCalculationDispatchContext);

  ComicService.init({ dispatchSetting, dispatchStatus, dispatchPaging });

  return <>{children}</>;
};

export interface ComicProviderProps {
  children: React.ReactNode,
  settingState?: Partial<ComicSettingState>,
  pagingState?: Partial<ComicCalculationState>,
  statusState?: Partial<ComicStatusState>,
}

export const ComicProvider: React.FunctionComponent<ComicProviderProps> = ({ children, settingState, pagingState, statusState }: ComicProviderProps) => {
  return (
    <ComicSettingContextProvider customInitialState={settingState}>
      <ComicCalculationContextProvider customInitialState={pagingState}>
        <ComicStatusContextProvider customInitialState={statusState}>
          <ComicContextInitializer>
            {children}
          </ComicContextInitializer>
        </ComicStatusContextProvider>
      </ComicCalculationContextProvider>
    </ComicSettingContextProvider>
  );
};

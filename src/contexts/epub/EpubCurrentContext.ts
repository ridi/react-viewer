import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum EpubCurrentActionType {
  UPDATE_CURRENT = 'update_current',
}

export enum EpubCurrentProperties {
  CURRENT_PAGE = 'currentPage',
  CURRENT_SPINE_INDEX = 'currentSpineIndex',
  CURRENT_POSITION = 'currentPosition',
}

export type EpubCurrentAction = { type: EpubCurrentActionType.UPDATE_CURRENT, current: Partial<EpubCurrentState> };

export type EpubCurrentState = {
  [EpubCurrentProperties.CURRENT_PAGE]: number,
  [EpubCurrentProperties.CURRENT_SPINE_INDEX]: number,  // 0-based
  [EpubCurrentProperties.CURRENT_POSITION]: number,    // 0 ~ 1
};

export const initialEpubCurrentState: EpubCurrentState = {
  [EpubCurrentProperties.CURRENT_PAGE]: 1,
  [EpubCurrentProperties.CURRENT_SPINE_INDEX]: 0, // 0-based
  [EpubCurrentProperties.CURRENT_POSITION]: 0,   // 0 ~ 1 (float)
};

export const EpubCurrentReducer: React.Reducer<EpubCurrentState, EpubCurrentAction> = (state, action) => {
  switch (action.type) {
    case EpubCurrentActionType.UPDATE_CURRENT:
      return { ...state, ...action.current };
    default:
      return state;
  }
};

export const {
  DispatchContext: EpubCurrentDispatchContext,
  StateContext: EpubCurrentContext,
  ContextProvider: EpubCurrentContextProvider,
} = generateContext(EpubCurrentReducer, initialEpubCurrentState, 'EpubCurrent');

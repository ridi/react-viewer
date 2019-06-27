import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum EpubCurrentActionType {
  UPDATE_CURRENT = 'update_current',
  SET_READY_TO_READ = 'set_ready_to_read',
}

export enum EpubCurrentProperties {
  CURRENT_PAGE = 'currentPage',
  CURRENT_SPINE_INDEX = 'currentSpineIndex',
  CURRENT_POSITION = 'currentPosition',
  READY_TO_READ = 'readyToRead',
  VISIBLE_SPINE_INDEXES = 'visibleSpineIndexes',
}

export type EpubCurrentAction =
  { type: EpubCurrentActionType.UPDATE_CURRENT, current: Partial<EpubCurrentState> }
  | { type: EpubCurrentActionType.SET_READY_TO_READ, readyToRead: boolean };

export type EpubCurrentState = {
  [EpubCurrentProperties.CURRENT_PAGE]: number,
  [EpubCurrentProperties.CURRENT_SPINE_INDEX]: number,  // 0-based
  [EpubCurrentProperties.CURRENT_POSITION]: number,    // 0 ~ 1
  [EpubCurrentProperties.READY_TO_READ]: boolean,
  [EpubCurrentProperties.VISIBLE_SPINE_INDEXES]: number[],
};

export const initialEpubCurrentState: EpubCurrentState = {
  [EpubCurrentProperties.CURRENT_PAGE]: 1,
  [EpubCurrentProperties.CURRENT_SPINE_INDEX]: 0, // 0-based
  [EpubCurrentProperties.CURRENT_POSITION]: 0,   // 0 ~ 1 (float)
  [EpubCurrentProperties.READY_TO_READ]: false,
  [EpubCurrentProperties.VISIBLE_SPINE_INDEXES]: [],
};

export const EpubCurrentReducer: React.Reducer<EpubCurrentState, EpubCurrentAction> = (state, action) => {
  switch (action.type) {
    case EpubCurrentActionType.UPDATE_CURRENT:
      return { ...state, ...action.current };
    case EpubCurrentActionType.SET_READY_TO_READ:
      return { ...state, readyToRead: action.readyToRead };
    default:
      return state;
  }
};

export const {
  DispatchContext: EpubCurrentDispatchContext,
  StateContext: EpubCurrentContext,
  ContextProvider: EpubCurrentContextProvider,
} = generateContext(EpubCurrentReducer, initialEpubCurrentState, 'EpubCurrent');

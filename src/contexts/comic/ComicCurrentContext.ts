import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum ComicCurrentActionType {
  UPDATE_CURRENT = 'update_current',
  SET_READY_TO_READ = 'set_ready_to_read',
}

export enum ComicCurrentProperties {
  CURRENT_PAGE = 'currentPage',
  READY_TO_READ = 'readyToRead',
}

export type ComicCurrentAction =
  { type: ComicCurrentActionType.UPDATE_CURRENT, current: Partial<ComicCurrentState> }
  | { type: ComicCurrentActionType.SET_READY_TO_READ, readyToRead: boolean };

export type ComicCurrentState = {
  [ComicCurrentProperties.CURRENT_PAGE]: number,
  [ComicCurrentProperties.READY_TO_READ]: boolean,
};

export const initialComicCurrentState: ComicCurrentState = {
  [ComicCurrentProperties.CURRENT_PAGE]: 1,
  [ComicCurrentProperties.READY_TO_READ]: false,
};

export const ComicCurrentReducer: React.Reducer<ComicCurrentState, ComicCurrentAction> = (state, action) => {
  switch(action.type) {
    case ComicCurrentActionType.UPDATE_CURRENT:
      return { ...state, ...action.current };
    case ComicCurrentActionType.SET_READY_TO_READ:
      return { ...state, readyToRead: action.readyToRead };
    default:
      return state;
  }
};

export const {
  DispatchContext: ComicCurrentDispatchContext,
  StateContext: ComicCurrentContext,
  ContextProvider: ComicCurrentContextProvider,
} = generateContext(ComicCurrentReducer, initialComicCurrentState, 'ComicCurrent');

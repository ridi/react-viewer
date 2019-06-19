import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum ComicCurrentActionType {
  UPDATE_CURRENT = 'update_current',
}

export enum ComicCurrentProperties {
  CURRENT_PAGE = 'currentPage',
}

export type ComicCurrentAction = { type: ComicCurrentActionType.UPDATE_CURRENT, current: Partial<ComicCurrentState> };

export type ComicCurrentState = {
  [ComicCurrentProperties.CURRENT_PAGE]: number,
};

export const initialComicCurrentState: ComicCurrentState = {
  [ComicCurrentProperties.CURRENT_PAGE]: 1,
};

export const ComicCurrentReducer: React.Reducer<ComicCurrentState, ComicCurrentAction> = (state, action) => {
  switch(action.type) {
    case ComicCurrentActionType.UPDATE_CURRENT:
      return { ...state, ...action.current };
    default:
      return state;
  }
};

export const {
  DispatchContext: ComicCurrentDispatchContext,
  StateContext: ComicCurrentContext,
  ContextProvider: ComicCurrentContextProvider,
} = generateContext(ComicCurrentReducer, initialComicCurrentState, 'ComicCurrent');

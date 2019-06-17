import * as React from 'react';
import { generateContext } from './ContextProvider';

export enum PagingActionType {
  UPDATE_PAGING,
}

export type PagingAction = { type: PagingActionType.UPDATE_PAGING, paging: Partial<PagingState> };

export type PagingState = {
  totalPage: number,
  currentPage: number,
  fullHeight: number,
  fullWidth: number,
  pageUnit: number,
};

export const initialPagingState: PagingState = {
  totalPage: 0,
  currentPage: 20,  // todo fix to 1
  fullHeight: 0,
  fullWidth: 0,
  pageUnit: 0,
};

export const PagingReducer: React.Reducer<PagingState, PagingAction> = (state, action) => {
  switch(action.type) {
    case PagingActionType.UPDATE_PAGING:
      return { ...state, ...action.paging };
    default:
      return state;
  }
};

export const {
  DispatchContext: PagingDispatchContext,
  StateContext: PagingContext,
  ContextProvider: PagingContextProvider,
} = generateContext(PagingReducer, initialPagingState, 'Paging');

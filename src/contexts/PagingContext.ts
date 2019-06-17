import * as React from 'react';
import { generateContext } from './ContextProvider';

export enum PagingActionType {
  UPDATE_PAGING,
}

export type PagingAction = { type: PagingActionType.UPDATE_PAGING, paging: Partial<PagingState> };

export type SpinePagingState = {
  spineIndex: number, // 1-based
  offset: number,
  total: number,
};

export type PagingState = {
  totalPage: number,
  fullHeight: number,
  fullWidth: number,
  pageUnit: number,
  currentPage: number,
  currentSpineIndex: number, // 1-based
  currentPosition: number,   // 0 ~ 1
  spines: Array<SpinePagingState>,  // offset and fullSize per spine
};

export const initialPagingState: PagingState = {
  totalPage: 0,
  fullHeight: 0,
  fullWidth: 0,
  pageUnit: 0,
  currentPage: 1,
  currentSpineIndex: 1, // 1-based
  currentPosition: 0,   // 0 ~ 1
  spines: [],
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

import * as React from 'react';
import { generateContext } from './ContextProvider';

export enum PagingActionType {
  UPDATE_PAGING = 'update_paging',
}

export enum PagingProperties {
  TOTAL_PAGE = 'totalPage',
  FULL_HEIGHT = 'fullHeight',
  FULL_WIDTH = 'fullWidth',
  PAGE_UNIT = 'pageUnit',
  CURRENT_PAGE = 'currentPage',
  CURRENT_SPINE_INDEX = 'currentSpineIndex',
  CURRENT_POSITION = 'currentPosition',
  SPINES = 'spines',
}

export type PagingAction = { type: PagingActionType.UPDATE_PAGING, paging: Partial<PagingState> };

export type SpinePagingState = {
  spineIndex: number, // 1-based
  offset: number,     // start offset in px
  total: number,      // total width or height in px
  pageOffset: number, // start page
  totalPage: number,  // total page number
};

export type PagingState = {
  [PagingProperties.TOTAL_PAGE]: number,
  [PagingProperties.FULL_HEIGHT]: number,
  [PagingProperties.FULL_WIDTH]: number,
  [PagingProperties.PAGE_UNIT]: number,
  [PagingProperties.CURRENT_PAGE]: number,
  [PagingProperties.CURRENT_SPINE_INDEX]: number,  // 1-based
  [PagingProperties.CURRENT_POSITION]: number,    // 0 ~ 1
  [PagingProperties.SPINES]: Array<SpinePagingState>,  // per spine paging information
};

export const initialPagingState: PagingState = {
  [PagingProperties.TOTAL_PAGE]: 0,
  [PagingProperties.FULL_HEIGHT]: 0,
  [PagingProperties.FULL_WIDTH]: 0,
  [PagingProperties.PAGE_UNIT]: 0,
  [PagingProperties.CURRENT_PAGE]: 1,
  [PagingProperties.CURRENT_SPINE_INDEX]: 1, // 1-based
  [PagingProperties.CURRENT_POSITION]: 0,   // 0 ~ 1 (float)
  [PagingProperties.SPINES]: [],
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

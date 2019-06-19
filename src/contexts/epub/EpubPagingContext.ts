import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum EpubPagingActionType {
  UPDATE_PAGING = 'update_paging',
}

export enum EpubPagingProperties {
  TOTAL_PAGE = 'totalPage',
  FULL_HEIGHT = 'fullHeight',
  FULL_WIDTH = 'fullWidth',
  PAGE_UNIT = 'pageUnit',
  CURRENT_PAGE = 'currentPage',
  CURRENT_SPINE_INDEX = 'currentSpineIndex',
  CURRENT_POSITION = 'currentPosition',
  SPINES = 'spines',
}

export type EpubPagingAction = { type: EpubPagingActionType.UPDATE_PAGING, paging: Partial<EpubPagingState> };

export type SpinePagingState = {
  spineIndex: number, // 1-based
  offset: number,     // start offset in px
  total: number,      // total width or height in px
  pageOffset: number, // start page
  totalPage: number,  // total page number
};

export type EpubPagingState = {
  [EpubPagingProperties.TOTAL_PAGE]: number,
  [EpubPagingProperties.FULL_HEIGHT]: number,
  [EpubPagingProperties.FULL_WIDTH]: number,
  [EpubPagingProperties.PAGE_UNIT]: number,
  [EpubPagingProperties.CURRENT_PAGE]: number,
  [EpubPagingProperties.CURRENT_SPINE_INDEX]: number,  // 1-based
  [EpubPagingProperties.CURRENT_POSITION]: number,    // 0 ~ 1
  [EpubPagingProperties.SPINES]: Array<SpinePagingState>,  // per spine paging information
};

export const initialEpubPagingState: EpubPagingState = {
  [EpubPagingProperties.TOTAL_PAGE]: 0,
  [EpubPagingProperties.FULL_HEIGHT]: 0,
  [EpubPagingProperties.FULL_WIDTH]: 0,
  [EpubPagingProperties.PAGE_UNIT]: 0,
  [EpubPagingProperties.CURRENT_PAGE]: 1,
  [EpubPagingProperties.CURRENT_SPINE_INDEX]: 1, // 1-based
  [EpubPagingProperties.CURRENT_POSITION]: 0,   // 0 ~ 1 (float)
  [EpubPagingProperties.SPINES]: [],
};

export const EpubPagingReducer: React.Reducer<EpubPagingState, EpubPagingAction> = (state, action) => {
  switch (action.type) {
    case EpubPagingActionType.UPDATE_PAGING:
      return { ...state, ...action.paging };
    default:
      return state;
  }
};

export const {
  DispatchContext: EpubPagingDispatchContext,
  StateContext: EpubPagingContext,
  ContextProvider: EpubPagingContextProvider,
} = generateContext(EpubPagingReducer, initialEpubPagingState, 'EpubPaging');

import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum EpubCalculationActionType {
  UPDATE_PAGING = 'update_paging',
}

export enum EpubCalculationProperties {
  TOTAL_PAGE = 'totalPage',
  FULL_HEIGHT = 'fullHeight',
  FULL_WIDTH = 'fullWidth',
  PAGE_UNIT = 'pageUnit',
  CURRENT_PAGE = 'currentPage',
  CURRENT_SPINE_INDEX = 'currentSpineIndex',
  CURRENT_POSITION = 'currentPosition',
  SPINES = 'spines',
}

export type EpubCalculationAction = { type: EpubCalculationActionType.UPDATE_PAGING, paging: Partial<EpubCalculationState> };

export type SpinePagingState = {
  spineIndex: number, // 0-based
  offset: number,     // start offset in px
  total: number,      // total width or height in px
  startPage: number,  // 1-based start page
  totalPage: number,  // total page number
};

export type EpubCalculationState = {
  [EpubCalculationProperties.TOTAL_PAGE]: number,
  [EpubCalculationProperties.FULL_HEIGHT]: number,
  [EpubCalculationProperties.FULL_WIDTH]: number,
  [EpubCalculationProperties.PAGE_UNIT]: number,
  [EpubCalculationProperties.CURRENT_PAGE]: number,
  [EpubCalculationProperties.CURRENT_SPINE_INDEX]: number,  // 0-based
  [EpubCalculationProperties.CURRENT_POSITION]: number,     // 0 ~ 1
  [EpubCalculationProperties.SPINES]: Array<SpinePagingState>,  // per spine paging information
};

export const initialEpubCalculationState: EpubCalculationState = {
  [EpubCalculationProperties.TOTAL_PAGE]: 0,
  [EpubCalculationProperties.FULL_HEIGHT]: 0,
  [EpubCalculationProperties.FULL_WIDTH]: 0,
  [EpubCalculationProperties.PAGE_UNIT]: 0,
  [EpubCalculationProperties.CURRENT_PAGE]: 1,
  [EpubCalculationProperties.CURRENT_SPINE_INDEX]: 0, // 0-based
  [EpubCalculationProperties.CURRENT_POSITION]: 0,    // 0 ~ 1 (float)
  [EpubCalculationProperties.SPINES]: [],
};

export const EpubCalculationReducer: React.Reducer<EpubCalculationState, EpubCalculationAction> = (state, action) => {
  switch (action.type) {
    case EpubCalculationActionType.UPDATE_PAGING:
      return { ...state, ...action.paging };
    default:
      return state;
  }
};

export const {
  DispatchContext: EpubCalculationDispatchContext,
  StateContext: EpubCalculationContext,
  ContextProvider: EpubCalculationContextProvider,
} = generateContext(EpubCalculationReducer, initialEpubCalculationState, 'EpubCalculation');

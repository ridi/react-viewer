import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum EpubCalculationActionType {
  UPDATE_CALCULATION = 'update_calculation',
}

export enum EpubCalculationProperties {
  TOTAL_PAGE = 'totalPage',   // TOTAL_PAGE = TOTAL / PAGE_CALCULATION_UNIT
  TOTAL = 'total',
  PAGE_UNIT = 'pageUnit',
  SPINES = 'spines',
}

export type EpubCalculationAction = { type: EpubCalculationActionType.UPDATE_CALCULATION, calculation: Partial<EpubCalculationState> };

export type SpineCalculationState = {
  spineIndex: number, // 0-based
  offset: number,     // start offset in px
  total: number,      // total width or height in px
  startPage: number,  // 1-based start page
  totalPage: number,  // total page number
};

export type EpubCalculationState = {
  [EpubCalculationProperties.TOTAL_PAGE]: number,
  [EpubCalculationProperties.TOTAL]: number,
  [EpubCalculationProperties.PAGE_UNIT]: number,
  [EpubCalculationProperties.SPINES]: Array<SpineCalculationState>,  // per spine paging information
};

export const initialEpubCalculationState: EpubCalculationState = {
  [EpubCalculationProperties.TOTAL_PAGE]: 0,
  [EpubCalculationProperties.TOTAL]: 0,
  [EpubCalculationProperties.PAGE_UNIT]: 0,
  [EpubCalculationProperties.SPINES]: [],
};

export const EpubCalculationReducer: React.Reducer<EpubCalculationState, EpubCalculationAction> = (state, action) => {
  switch (action.type) {
    case EpubCalculationActionType.UPDATE_CALCULATION:
      return { ...state, ...action.calculation };
    default:
      return state;
  }
};

export const {
  DispatchContext: EpubCalculationDispatchContext,
  StateContext: EpubCalculationContext,
  ContextProvider: EpubCalculationContextProvider,
} = generateContext(EpubCalculationReducer, initialEpubCalculationState, 'EpubCalculation');

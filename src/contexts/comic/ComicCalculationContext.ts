import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum ComicCalculationActionType {
  UPDATE_CALCULATION = 'update_calculation',
}

export enum ComicCalculationProperties {
  TOTAL_PAGE = 'totalPage',
  PAGE_UNIT = 'pageUnit',
  IMAGES = 'images',
}

export type ComicCalculationAction = { type: ComicCalculationActionType.UPDATE_CALCULATION, calculation: Partial<ComicCalculationState> };

export type ImageCalculationState = {
  imageIndex: number, // 0-based
  /**
   * height / width
   * immutable value
   */
  ratio: number,      // height / width
  /**
   *  start offset in px on scroll view mode
   *  modified when resizing or changing setting.contentWidth
   */
  offsetTop: number,
  height: number,
};

export type ComicCalculationState = {
  [ComicCalculationProperties.TOTAL_PAGE]: number,   // fixed value
  [ComicCalculationProperties.PAGE_UNIT]: number,    // only page view - modified on resizing
  [ComicCalculationProperties.IMAGES]: Array<ImageCalculationState>,
};

export const initialComicCalculationState: ComicCalculationState = {
  [ComicCalculationProperties.TOTAL_PAGE]: 0,
  [ComicCalculationProperties.PAGE_UNIT]: 0,
  [ComicCalculationProperties.IMAGES]: [],
};

export const ComicCalculationReducer: React.Reducer<ComicCalculationState, ComicCalculationAction> = (state, action) => {
  switch(action.type) {
    case ComicCalculationActionType.UPDATE_CALCULATION:
      return { ...state, ...action.calculation };
    default:
      return state;
  }
};

export const {
  DispatchContext: ComicCalculationDispatchContext,
  StateContext: ComicCalculationContext,
  ContextProvider: ComicCalculationContextProvider,
} = generateContext(ComicCalculationReducer, initialComicCalculationState, 'ComicCalculation');

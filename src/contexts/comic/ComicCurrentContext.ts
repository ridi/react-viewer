import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum ComicCalculationActionType {
  UPDATE_PAGING = 'update_paging',
}

export enum ComicCalculationProperties {
  TOTAL_PAGE = 'totalPage',
  PAGE_UNIT = 'pageUnit',
  CURRENT_PAGE = 'currentPage',
  IMAGES = 'images',
}

export type ComicCalculationAction = { type: ComicCalculationActionType.UPDATE_PAGING, paging: Partial<ComicCalculationState> };

export type ImagePagingState = {
  imageIndex: number, // 1-based
  /**
   *  start offset in px on scroll view mode
   *  modified when resizing or changing setting.contentWidth
   */
  offsetTop: number,
  /**
   * height / width
   * immutable value
   */
  ratio: number,      // height / width
  height: number,
};

export type ComicCalculationState = {
  [ComicCalculationProperties.TOTAL_PAGE]: number,   // fixed value
  [ComicCalculationProperties.PAGE_UNIT]: number,    // only page view - modified on resizing
  [ComicCalculationProperties.CURRENT_PAGE]: number,
  [ComicCalculationProperties.IMAGES]: Array<ImagePagingState>,
};

export const initialComicCalculationState: ComicCalculationState = {
  [ComicCalculationProperties.TOTAL_PAGE]: 0,
  [ComicCalculationProperties.PAGE_UNIT]: 0,
  [ComicCalculationProperties.CURRENT_PAGE]: 1,
  [ComicCalculationProperties.IMAGES]: [],
};

export const ComicCalculationReducer: React.Reducer<ComicCalculationState, ComicCalculationAction> = (state, action) => {
  switch(action.type) {
    case ComicCalculationActionType.UPDATE_PAGING:
      return { ...state, ...action.paging };
    default:
      return state;
  }
};

export const {
  DispatchContext: ComicCalculationDispatchContext,
  StateContext: ComicCalculationContext,
  ContextProvider: ComicCalculationContextProvider,
} = generateContext(ComicCalculationReducer, initialComicCalculationState, 'ComicCalculation');

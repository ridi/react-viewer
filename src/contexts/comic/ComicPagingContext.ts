import * as React from 'react';
import { generateContext } from '../ContextProvider';

export enum ComicPagingActionType {
  UPDATE_PAGING = 'update_paging',
}

export enum ComicPagingProperties {
  TOTAL_PAGE = 'totalPage',
  PAGE_UNIT = 'pageUnit',
  CURRENT_PAGE = 'currentPage',
  IMAGES = 'images',
}

export type ComicPagingAction = { type: ComicPagingActionType.UPDATE_PAGING, paging: Partial<ComicPagingState> };

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

export type ComicPagingState = {
  [ComicPagingProperties.TOTAL_PAGE]: number,   // fixed value
  [ComicPagingProperties.PAGE_UNIT]: number,    // only page view - modified on resizing
  [ComicPagingProperties.CURRENT_PAGE]: number,
  [ComicPagingProperties.IMAGES]: Array<ImagePagingState>,
};

export const initialComicPagingState: ComicPagingState = {
  [ComicPagingProperties.TOTAL_PAGE]: 0,
  [ComicPagingProperties.PAGE_UNIT]: 0,
  [ComicPagingProperties.CURRENT_PAGE]: 1,
  [ComicPagingProperties.IMAGES]: [],
};

export const ComicPagingReducer: React.Reducer<ComicPagingState, ComicPagingAction> = (state, action) => {
  switch(action.type) {
    case ComicPagingActionType.UPDATE_PAGING:
      return { ...state, ...action.paging };
    default:
      return state;
  }
};

export const {
  DispatchContext: ComicPagingDispatchContext,
  StateContext: ComicPagingContext,
  ContextProvider: ComicPagingContextProvider,
} = generateContext(ComicPagingReducer, initialComicPagingState, 'ComicPaging');

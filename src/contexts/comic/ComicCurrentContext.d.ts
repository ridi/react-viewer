import * as React from 'react';
export declare enum ComicCalculationActionType {
    UPDATE_PAGING = "update_paging"
}
export declare enum ComicCalculationProperties {
    TOTAL_PAGE = "totalPage",
    PAGE_UNIT = "pageUnit",
    CURRENT_PAGE = "currentPage",
    IMAGES = "images"
}
export declare type ComicCalculationAction = {
    type: ComicCalculationActionType.UPDATE_PAGING;
    paging: Partial<ComicCalculationState>;
};
export declare type ImagePagingState = {
    imageIndex: number;
    /**
     *  start offset in px on scroll view mode
     *  modified when resizing or changing setting.contentWidth
     */
    offsetTop: number;
    /**
     * height / width
     * immutable value
     */
    ratio: number;
    height: number;
};
export declare type ComicCalculationState = {
    [ComicCalculationProperties.TOTAL_PAGE]: number;
    [ComicCalculationProperties.PAGE_UNIT]: number;
    [ComicCalculationProperties.CURRENT_PAGE]: number;
    [ComicCalculationProperties.IMAGES]: Array<ImagePagingState>;
};
export declare const initialComicCalculationState: ComicCalculationState;
export declare const ComicCalculationReducer: React.Reducer<ComicCalculationState, ComicCalculationAction>;
export declare const ComicCalculationDispatchContext: React.Context<React.Dispatch<ComicCalculationAction>>, ComicCalculationContext: React.Context<ComicCalculationState>, ComicCalculationContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<ComicCalculationState> | undefined;
}>;

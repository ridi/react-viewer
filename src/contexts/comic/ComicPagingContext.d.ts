import * as React from 'react';
export declare enum ComicPagingActionType {
    UPDATE_PAGING = "update_paging"
}
export declare enum ComicPagingProperties {
    TOTAL_PAGE = "totalPage",
    PAGE_UNIT = "pageUnit",
    CURRENT_PAGE = "currentPage",
    IMAGES = "images"
}
export declare type ComicPagingAction = {
    type: ComicPagingActionType.UPDATE_PAGING;
    paging: Partial<ComicPagingState>;
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
export declare type ComicPagingState = {
    [ComicPagingProperties.TOTAL_PAGE]: number;
    [ComicPagingProperties.PAGE_UNIT]: number;
    [ComicPagingProperties.CURRENT_PAGE]: number;
    [ComicPagingProperties.IMAGES]: Array<ImagePagingState>;
};
export declare const initialComicPagingState: ComicPagingState;
export declare const ComicPagingReducer: React.Reducer<ComicPagingState, ComicPagingAction>;
export declare const ComicPagingDispatchContext: React.Context<React.Dispatch<ComicPagingAction>>, ComicPagingContext: React.Context<ComicPagingState>, ComicPagingContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<ComicPagingState> | undefined;
}>;

import * as React from 'react';
export declare enum EpubPagingActionType {
    UPDATE_PAGING = "update_paging"
}
export declare enum EpubPagingProperties {
    TOTAL_PAGE = "totalPage",
    FULL_HEIGHT = "fullHeight",
    FULL_WIDTH = "fullWidth",
    PAGE_UNIT = "pageUnit",
    CURRENT_PAGE = "currentPage",
    CURRENT_SPINE_INDEX = "currentSpineIndex",
    CURRENT_POSITION = "currentPosition",
    SPINES = "spines"
}
export declare type EpubPagingAction = {
    type: EpubPagingActionType.UPDATE_PAGING;
    paging: Partial<EpubPagingState>;
};
export declare type SpinePagingState = {
    spineIndex: number;
    offset: number;
    total: number;
    pageOffset: number;
    totalPage: number;
};
export declare type EpubPagingState = {
    [EpubPagingProperties.TOTAL_PAGE]: number;
    [EpubPagingProperties.FULL_HEIGHT]: number;
    [EpubPagingProperties.FULL_WIDTH]: number;
    [EpubPagingProperties.PAGE_UNIT]: number;
    [EpubPagingProperties.CURRENT_PAGE]: number;
    [EpubPagingProperties.CURRENT_SPINE_INDEX]: number;
    [EpubPagingProperties.CURRENT_POSITION]: number;
    [EpubPagingProperties.SPINES]: Array<SpinePagingState>;
};
export declare const initialEpubPagingState: EpubPagingState;
export declare const EpubPagingReducer: React.Reducer<EpubPagingState, EpubPagingAction>;
export declare const EpubPagingDispatchContext: React.Context<React.Dispatch<EpubPagingAction>>, EpubPagingContext: React.Context<EpubPagingState>, EpubPagingContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<EpubPagingState> | undefined;
}>;

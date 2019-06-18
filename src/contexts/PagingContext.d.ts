import * as React from 'react';
export declare enum PagingActionType {
    UPDATE_PAGING = "update_paging"
}
export declare enum PagingProperties {
    TOTAL_PAGE = "totalPage",
    FULL_HEIGHT = "fullHeight",
    FULL_WIDTH = "fullWidth",
    PAGE_UNIT = "pageUnit",
    CURRENT_PAGE = "currentPage",
    CURRENT_SPINE_INDEX = "currentSpineIndex",
    CURRENT_POSITION = "currentPosition",
    SPINES = "spines"
}
export declare type PagingAction = {
    type: PagingActionType.UPDATE_PAGING;
    paging: Partial<PagingState>;
};
export declare type SpinePagingState = {
    spineIndex: number;
    offset: number;
    total: number;
    pageOffset: number;
    totalPage: number;
};
export declare type PagingState = {
    [PagingProperties.TOTAL_PAGE]: number;
    [PagingProperties.FULL_HEIGHT]: number;
    [PagingProperties.FULL_WIDTH]: number;
    [PagingProperties.PAGE_UNIT]: number;
    [PagingProperties.CURRENT_PAGE]: number;
    [PagingProperties.CURRENT_SPINE_INDEX]: number;
    [PagingProperties.CURRENT_POSITION]: number;
    [PagingProperties.SPINES]: Array<SpinePagingState>;
};
export declare const initialPagingState: PagingState;
export declare const PagingReducer: React.Reducer<PagingState, PagingAction>;
export declare const PagingDispatchContext: React.Context<React.Dispatch<PagingAction>>, PagingContext: React.Context<PagingState>, PagingContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<PagingState> | undefined;
}>;

import * as React from 'react';
export declare enum PagingActionType {
    UPDATE_PAGING = 0
}
export declare type PagingAction = {
    type: PagingActionType.UPDATE_PAGING;
    paging: Partial<PagingState>;
};
export declare type SpinePagingState = {
    spineIndex: number;
    offset: number;
    total: number;
};
export declare type PagingState = {
    totalPage: number;
    fullHeight: number;
    fullWidth: number;
    pageUnit: number;
    currentPage: number;
    currentSpineIndex: number;
    currentPosition: number;
    spines: Array<SpinePagingState>;
};
export declare const initialPagingState: PagingState;
export declare const PagingReducer: React.Reducer<PagingState, PagingAction>;
export declare const PagingDispatchContext: React.Context<React.Dispatch<PagingAction>>, PagingContext: React.Context<PagingState>, PagingContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: PagingState | undefined;
}>;

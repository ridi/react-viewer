import * as React from 'react';
export declare enum EpubCalculationActionType {
    UPDATE_PAGING = "update_paging"
}
export declare enum EpubCalculationProperties {
    TOTAL_PAGE = "totalPage",
    FULL_HEIGHT = "fullHeight",
    FULL_WIDTH = "fullWidth",
    PAGE_UNIT = "pageUnit",
    CURRENT_PAGE = "currentPage",
    CURRENT_SPINE_INDEX = "currentSpineIndex",
    CURRENT_POSITION = "currentPosition",
    SPINES = "spines"
}
export declare type EpubCalculationAction = {
    type: EpubCalculationActionType.UPDATE_PAGING;
    paging: Partial<EpubCalculationState>;
};
export declare type SpinePagingState = {
    spineIndex: number;
    offset: number;
    total: number;
    startPage: number;
    totalPage: number;
};
export declare type EpubCalculationState = {
    [EpubCalculationProperties.TOTAL_PAGE]: number;
    [EpubCalculationProperties.FULL_HEIGHT]: number;
    [EpubCalculationProperties.FULL_WIDTH]: number;
    [EpubCalculationProperties.PAGE_UNIT]: number;
    [EpubCalculationProperties.CURRENT_PAGE]: number;
    [EpubCalculationProperties.CURRENT_SPINE_INDEX]: number;
    [EpubCalculationProperties.CURRENT_POSITION]: number;
    [EpubCalculationProperties.SPINES]: Array<SpinePagingState>;
};
export declare const initialEpubCalculationState: EpubCalculationState;
export declare const EpubCalculationReducer: React.Reducer<EpubCalculationState, EpubCalculationAction>;
export declare const EpubCalculationDispatchContext: React.Context<React.Dispatch<EpubCalculationAction>>, EpubCalculationContext: React.Context<EpubCalculationState>, EpubCalculationContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<EpubCalculationState> | undefined;
}>;

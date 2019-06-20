import * as React from 'react';
export declare enum EpubCalculationActionType {
    UPDATE_CALCULATION = "update_calculation"
}
export declare enum EpubCalculationProperties {
    TOTAL_PAGE = "totalPage",
    FULL_HEIGHT = "fullHeight",
    FULL_WIDTH = "fullWidth",
    PAGE_UNIT = "pageUnit",
    SPINES = "spines"
}
export declare type EpubCalculationAction = {
    type: EpubCalculationActionType.UPDATE_CALCULATION;
    calculation: Partial<EpubCalculationState>;
};
export declare type SpineCalculationState = {
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
    [EpubCalculationProperties.SPINES]: Array<SpineCalculationState>;
};
export declare const initialEpubCalculationState: EpubCalculationState;
export declare const EpubCalculationReducer: React.Reducer<EpubCalculationState, EpubCalculationAction>;
export declare const EpubCalculationDispatchContext: React.Context<React.Dispatch<EpubCalculationAction>>, EpubCalculationContext: React.Context<EpubCalculationState>, EpubCalculationContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<EpubCalculationState> | undefined;
}>;

import * as React from 'react';
export declare enum EpubCurrentActionType {
    UPDATE_CURRENT = "update_current"
}
export declare enum EpubCurrentProperties {
    CURRENT_PAGE = "currentPage",
    CURRENT_SPINE_INDEX = "currentSpineIndex",
    CURRENT_POSITION = "currentPosition"
}
export declare type EpubCurrentAction = {
    type: EpubCurrentActionType.UPDATE_CURRENT;
    current: Partial<EpubCurrentState>;
};
export declare type EpubCurrentState = {
    [EpubCurrentProperties.CURRENT_PAGE]: number;
    [EpubCurrentProperties.CURRENT_SPINE_INDEX]: number;
    [EpubCurrentProperties.CURRENT_POSITION]: number;
};
export declare const initialEpubCurrentState: EpubCurrentState;
export declare const EpubCurrentReducer: React.Reducer<EpubCurrentState, EpubCurrentAction>;
export declare const EpubCurrentDispatchContext: React.Context<React.Dispatch<EpubCurrentAction>>, EpubCurrentContext: React.Context<EpubCurrentState>, EpubCurrentContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<EpubCurrentState> | undefined;
}>;

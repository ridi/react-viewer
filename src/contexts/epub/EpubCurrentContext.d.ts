import * as React from 'react';
export declare enum EpubCurrentActionType {
    UPDATE_CURRENT = "update_current",
    SET_READY_TO_READ = "set_ready_to_read"
}
export declare enum EpubCurrentProperties {
    CURRENT_PAGE = "currentPage",
    CURRENT_SPINE_INDEX = "currentSpineIndex",
    CURRENT_POSITION = "currentPosition",
    READY_TO_READ = "readyToRead"
}
export declare type EpubCurrentAction = {
    type: EpubCurrentActionType.UPDATE_CURRENT;
    current: Partial<EpubCurrentState>;
} | {
    type: EpubCurrentActionType.SET_READY_TO_READ;
    readyToRead: boolean;
};
export declare type EpubCurrentState = {
    [EpubCurrentProperties.CURRENT_PAGE]: number;
    [EpubCurrentProperties.CURRENT_SPINE_INDEX]: number;
    [EpubCurrentProperties.CURRENT_POSITION]: number;
    [EpubCurrentProperties.READY_TO_READ]: boolean;
};
export declare const initialEpubCurrentState: EpubCurrentState;
export declare const EpubCurrentReducer: React.Reducer<EpubCurrentState, EpubCurrentAction>;
export declare const EpubCurrentDispatchContext: React.Context<React.Dispatch<EpubCurrentAction>>, EpubCurrentContext: React.Context<EpubCurrentState>, EpubCurrentContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<EpubCurrentState> | undefined;
}>;

import * as React from 'react';
export declare enum ComicCurrentActionType {
    UPDATE_CURRENT = "update_current"
}
export declare enum ComicCurrentProperties {
    CURRENT_PAGE = "currentPage"
}
export declare type ComicCurrentAction = {
    type: ComicCurrentActionType.UPDATE_CURRENT;
    current: Partial<ComicCurrentState>;
};
export declare type ComicCurrentState = {
    [ComicCurrentProperties.CURRENT_PAGE]: number;
};
export declare const initialComicCurrentState: ComicCurrentState;
export declare const ComicCurrentReducer: React.Reducer<ComicCurrentState, ComicCurrentAction>;
export declare const ComicCurrentDispatchContext: React.Context<React.Dispatch<ComicCurrentAction>>, ComicCurrentContext: React.Context<ComicCurrentState>, ComicCurrentContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<ComicCurrentState> | undefined;
}>;

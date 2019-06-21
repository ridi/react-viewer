import * as React from 'react';
export declare enum ComicCurrentActionType {
    UPDATE_CURRENT = "update_current",
    SET_READY_TO_READ = "set_ready_to_read"
}
export declare enum ComicCurrentProperties {
    CURRENT_PAGE = "currentPage",
    READY_TO_READ = "readyToRead"
}
export declare type ComicCurrentAction = {
    type: ComicCurrentActionType.UPDATE_CURRENT;
    current: Partial<ComicCurrentState>;
} | {
    type: ComicCurrentActionType.SET_READY_TO_READ;
    readyToRead: boolean;
};
export declare type ComicCurrentState = {
    [ComicCurrentProperties.CURRENT_PAGE]: number;
    [ComicCurrentProperties.READY_TO_READ]: boolean;
};
export declare const initialComicCurrentState: ComicCurrentState;
export declare const ComicCurrentReducer: React.Reducer<ComicCurrentState, ComicCurrentAction>;
export declare const ComicCurrentDispatchContext: React.Context<React.Dispatch<ComicCurrentAction>>, ComicCurrentContext: React.Context<ComicCurrentState>, ComicCurrentContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<ComicCurrentState> | undefined;
}>;

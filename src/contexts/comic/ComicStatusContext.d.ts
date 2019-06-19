import * as React from 'react';
export declare enum ComicStatusActionType {
    SET_READY_TO_READ = "set_ready_to_read"
}
export declare enum ComicStatusProperties {
    READY_TO_READ = "readyToRead"
}
export declare type ComicStatusAction = {
    type: ComicStatusActionType.SET_READY_TO_READ;
    readyToRead: boolean;
};
export declare type ComicStatusState = {
    [ComicStatusProperties.READY_TO_READ]: boolean;
};
export declare const initialComicStatusState: ComicStatusState;
export declare const ComicStatusReducer: React.Reducer<ComicStatusState, ComicStatusAction>;
export declare const ComicStatusDispatchContext: React.Context<React.Dispatch<ComicStatusAction>>, ComicStatusContext: React.Context<ComicStatusState>, ComicStatusContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<ComicStatusState> | undefined;
}>;

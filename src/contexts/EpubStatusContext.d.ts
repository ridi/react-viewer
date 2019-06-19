import * as React from 'react';
export declare enum EpubStatusActionType {
    SET_READY_TO_READ = "set_ready_to_read"
}
export declare enum EpubStatusProperties {
    READY_TO_READ = "readyToRead"
}
export declare type EpubStatusAction = {
    type: EpubStatusActionType.SET_READY_TO_READ;
    readyToRead: boolean;
};
export declare type EpubStatusState = {
    [EpubStatusProperties.READY_TO_READ]: boolean;
};
export declare const initialEpubStatusState: EpubStatusState;
export declare const EpubStatusReducer: React.Reducer<EpubStatusState, EpubStatusAction>;
export declare const EpubStatusDispatchContext: React.Context<React.Dispatch<EpubStatusAction>>, EpubStatusContext: React.Context<EpubStatusState>, EpubStatusContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<EpubStatusState> | undefined;
}>;

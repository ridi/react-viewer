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
export declare type StatusState = {
    [EpubStatusProperties.READY_TO_READ]: boolean;
};
export declare const initialEpubStatusState: StatusState;
export declare const EpubStatusReducer: React.Reducer<StatusState, EpubStatusAction>;
export declare const EpubStatusDispatchContext: React.Context<React.Dispatch<EpubStatusAction>>, EpubStatusContext: React.Context<StatusState>, EpubStatusContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<StatusState> | undefined;
}>;

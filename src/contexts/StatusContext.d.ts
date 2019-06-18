import * as React from 'react';
export declare enum StatusActionType {
    SET_READY_TO_READ = "set_ready_to_read"
}
export declare enum StatusProperties {
    READY_TO_READ = "readyToRead"
}
export declare type StatusAction = {
    type: StatusActionType.SET_READY_TO_READ;
    readyToRead: boolean;
};
export declare type StatusState = {
    [StatusProperties.READY_TO_READ]: boolean;
};
export declare const initialStatusState: StatusState;
export declare const StatusReducer: React.Reducer<StatusState, StatusAction>;
export declare const StatusDispatchContext: React.Context<React.Dispatch<StatusAction>>, StatusContext: React.Context<StatusState>, StatusContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<StatusState> | undefined;
}>;

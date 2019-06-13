import * as React from 'react';
export declare enum StatusActionType {
    SET_START_TO_READ = 0
}
export declare type StatusAction = {
    type: StatusActionType.SET_START_TO_READ;
    startToRead: boolean;
};
export declare type StatusState = {
    startToRead: boolean;
};
export declare const initialStatusState: StatusState;
export declare const StatusReducer: React.Reducer<StatusState, StatusAction>;
export declare const StatusDispatchContext: React.Context<React.Dispatch<StatusAction>>, StatusContext: React.Context<StatusState>, StatusContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
}>;

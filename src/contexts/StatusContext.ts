import {generateContext} from './ContextProvider';
import * as React from 'react';

export enum StatusActionType {
  SET_READY_TO_READ = 'set_ready_to_read',
}

export enum StatusProperties {
  READY_TO_READ = 'readyToRead',
}

export type StatusAction = { type: StatusActionType.SET_READY_TO_READ, readyToRead: boolean };

export type StatusState = {
  [StatusProperties.READY_TO_READ]: boolean,
};

export const initialStatusState: StatusState = {
  [StatusProperties.READY_TO_READ]: false,
};

export const StatusReducer: React.Reducer<StatusState, StatusAction> = (state, action) => {
  switch(action.type) {
    case StatusActionType.SET_READY_TO_READ:
      return { ...state, readyToRead: action.readyToRead };
    default:
      return state;
  }
};

export const {
  DispatchContext: StatusDispatchContext,
  StateContext: StatusContext,
  ContextProvider: StatusContextProvider,
} = generateContext(StatusReducer, initialStatusState, 'Status');

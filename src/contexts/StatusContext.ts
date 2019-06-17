import {generateContext} from './ContextProvider';
import * as React from 'react';

export enum StatusActionType {
  SET_START_TO_READ,
}

export type StatusAction = { type: StatusActionType.SET_START_TO_READ, startToRead: boolean };

export type StatusState = {
  startToRead: boolean,
};

export const initialStatusState: StatusState = {
  startToRead: false,
};

export const StatusReducer: React.Reducer<StatusState, StatusAction> = (state, action) => {
  switch(action.type) {
    case StatusActionType.SET_START_TO_READ:
      return { ...state, startToRead: action.startToRead };
    default:
      return state;
  }
};

export const {
  DispatchContext: StatusDispatchContext,
  StateContext: StatusContext,
  ContextProvider: StatusContextProvider,
} = generateContext(StatusReducer, initialStatusState, 'Status');

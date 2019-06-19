import { generateContext } from '../ContextProvider';
import * as React from 'react';

export enum EpubStatusActionType {
  SET_READY_TO_READ = 'set_ready_to_read',
}

export enum EpubStatusProperties {
  READY_TO_READ = 'readyToRead',
}

export type EpubStatusAction = { type: EpubStatusActionType.SET_READY_TO_READ, readyToRead: boolean };

export type EpubStatusState = {
  [EpubStatusProperties.READY_TO_READ]: boolean,
};

export const initialEpubStatusState: EpubStatusState = {
  [EpubStatusProperties.READY_TO_READ]: false,
};

export const EpubStatusReducer: React.Reducer<EpubStatusState, EpubStatusAction> = (state, action) => {
  switch (action.type) {
    case EpubStatusActionType.SET_READY_TO_READ:
      return { ...state, readyToRead: action.readyToRead };
    default:
      return state;
  }
};

export const {
  DispatchContext: EpubStatusDispatchContext,
  StateContext: EpubStatusContext,
  ContextProvider: EpubStatusContextProvider,
} = generateContext(EpubStatusReducer, initialEpubStatusState, 'EpubStatus');

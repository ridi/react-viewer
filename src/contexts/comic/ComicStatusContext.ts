import { generateContext } from '../ContextProvider';
import * as React from 'react';

export enum ComicStatusActionType {
  SET_READY_TO_READ = 'set_ready_to_read',
}

export enum ComicStatusProperties {
  READY_TO_READ = 'readyToRead',
}

export type ComicStatusAction = { type: ComicStatusActionType.SET_READY_TO_READ, readyToRead: boolean };

export type ComicStatusState = {
  [ComicStatusProperties.READY_TO_READ]: boolean,
};

export const initialComicStatusState: ComicStatusState = {
  [ComicStatusProperties.READY_TO_READ]: false,
};

export const ComicStatusReducer: React.Reducer<ComicStatusState, ComicStatusAction> = (state, action) => {
  switch (action.type) {
    case ComicStatusActionType.SET_READY_TO_READ:
      return { ...state, readyToRead: action.readyToRead };
    default:
      return state;
  }
};

export const {
  DispatchContext: ComicStatusDispatchContext,
  StateContext: ComicStatusContext,
  ContextProvider: ComicStatusContextProvider,
} = generateContext(ComicStatusReducer, initialComicStatusState, 'ComicStatus');

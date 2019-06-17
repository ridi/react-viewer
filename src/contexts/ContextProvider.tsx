import * as React from "react";

interface ContextResult<S, A> {
  DispatchContext: React.Context<React.Dispatch<A>>;
  StateContext: React.Context<S>;
  ContextProvider: React.FunctionComponent<{ children: React.ReactNode, customInitialState?: S }>
}

export function generateContext<S, A>(reducer: React.Reducer<S, A>, initialState: S, displayName?: string): ContextResult<S, A> {
  const DispatchContext: React.Context<React.Dispatch<A>> = React.createContext<React.Dispatch<A>>(() => {});
  const StateContext: React.Context<S> = React.createContext<S>(initialState);

  DispatchContext.displayName = displayName ? `Dispatch.${displayName}` : 'Dispatch.Context';
  StateContext.displayName = displayName ? `State.${displayName}` : 'Context.State';

  const ContextProvider: React.FunctionComponent<{ children: React.ReactNode, customInitialState?: S }> = ({ children, customInitialState }) => {
    const [state, dispatch] = React.useReducer(reducer, customInitialState || initialState);

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  ContextProvider.displayName = displayName ? `${displayName}Provider` : 'ContextProvider';
  return {
    DispatchContext,
    StateContext,
    ContextProvider,
  };
}

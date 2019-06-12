import * as React from "react";

interface ContextResult<S, A> {
  DispatchContext: React.Context<React.Dispatch<A>>;
  StateContext: React.Context<S>;
  ContextProvider: React.FunctionComponent<{ children: React.ReactNode }>
}

export function generateContext<S, A>(reducer: React.Reducer<S, A>, initialState: S): ContextResult<S, A> {
  const DispatchContext: React.Context<React.Dispatch<A>> = React.createContext<React.Dispatch<A>>(() => {});
  const StateContext: React.Context<S> = React.createContext<S>(initialState);

  const ContextProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
    );
  };
  return {
    DispatchContext,
    StateContext,
    ContextProvider,
  };
}

import * as React from "react";
interface ContextResult<S, A> {
    DispatchContext: React.Context<React.Dispatch<A>>;
    StateContext: React.Context<S>;
    ContextProvider: React.FunctionComponent<{
        children: React.ReactNode;
        customInitialState?: S;
    }>;
}
export declare function generateContext<S, A>(reducer: React.Reducer<S, A>, initialState: S): ContextResult<S, A>;
export {};

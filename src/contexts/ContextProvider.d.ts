import * as React from "react";
interface ContextResult<S, A> {
    DispatchContext: React.Context<React.Dispatch<A>>;
    StateContext: React.Context<S>;
    ContextProvider: React.FunctionComponent<{
        children: React.ReactNode;
        customInitialState?: Partial<S>;
    }>;
}
export declare function generateContext<S, A>(reducer: React.Reducer<S, A>, initialState: S, displayName?: string): ContextResult<S, A>;
export {};
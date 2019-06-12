"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function generateContext(reducer, initialState) {
    var DispatchContext = React.createContext(function () { });
    var StateContext = React.createContext(initialState);
    var ContextProvider = function (_a) {
        var children = _a.children;
        var _b = React.useReducer(reducer, initialState), state = _b[0], dispatch = _b[1];
        return (React.createElement(DispatchContext.Provider, { value: dispatch },
            React.createElement(StateContext.Provider, { value: state }, children)));
    };
    return {
        DispatchContext: DispatchContext,
        StateContext: StateContext,
        ContextProvider: ContextProvider,
    };
}
exports.generateContext = generateContext;

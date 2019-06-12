"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var ContextProvider_1 = require("./ContextProvider");
var StatusActionType;
(function (StatusActionType) {
    StatusActionType[StatusActionType["SET_START_TO_READ"] = 0] = "SET_START_TO_READ";
})(StatusActionType = exports.StatusActionType || (exports.StatusActionType = {}));
exports.initialStatusState = {
    startToRead: false,
};
exports.StatusReducer = function (state, action) {
    switch (action.type) {
        case StatusActionType.SET_START_TO_READ:
            return __assign({}, state, { startToRead: action.startToRead });
        default:
            return state;
    }
};
exports.StatusDispatchContext = (_a = ContextProvider_1.generateContext(exports.StatusReducer, exports.initialStatusState), _a.DispatchContext), exports.StatusContext = _a.StateContext, exports.StatusContextProvider = _a.ContextProvider;

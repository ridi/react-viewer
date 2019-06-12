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
var PagingActionType;
(function (PagingActionType) {
    PagingActionType[PagingActionType["UPDATE_PAGING"] = 0] = "UPDATE_PAGING";
})(PagingActionType = exports.PagingActionType || (exports.PagingActionType = {}));
exports.initialPagingState = {
    totalPage: 0,
    currentPage: 20,
    fullHeight: 0,
    fullWidth: 0,
    pageUnit: 0,
};
exports.PagingReducer = function (state, action) {
    switch (action.type) {
        case PagingActionType.UPDATE_PAGING:
            return __assign({}, state, action.paging);
        default:
            return state;
    }
};
exports.PagingDispatchContext = (_a = ContextProvider_1.generateContext(exports.PagingReducer, exports.initialPagingState), _a.DispatchContext), exports.PagingContext = _a.StateContext, exports.PagingContextProvider = _a.ContextProvider;

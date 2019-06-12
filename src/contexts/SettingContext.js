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
var ViewType;
(function (ViewType) {
    ViewType[ViewType["SCROLL"] = 0] = "SCROLL";
    ViewType[ViewType["PAGE1"] = 1] = "PAGE1";
    ViewType[ViewType["PAGE12"] = 2] = "PAGE12";
    ViewType[ViewType["PAGE23"] = 3] = "PAGE23";
})(ViewType = exports.ViewType || (exports.ViewType = {}));
var SettingActionType;
(function (SettingActionType) {
    SettingActionType[SettingActionType["UPDATE_SETTING"] = 0] = "UPDATE_SETTING";
})(SettingActionType = exports.SettingActionType || (exports.SettingActionType = {}));
exports.initialSettingState = {
    viewType: ViewType.SCROLL,
    fontSizeInEm: 1,
    lineHeightInEm: 1.67,
    contentPaddingInPercent: 12,
    columnGapInPercent: 5,
    maxWidth: 700,
    containerHorizontalMargin: 30,
    containerVerticalMargin: 35,
    contentWidthInPercent: 100,
};
exports.settingReducer = function (state, action) {
    switch (action.type) {
        case SettingActionType.UPDATE_SETTING:
            return __assign({}, state, action.setting);
        default:
            return state;
    }
};
exports.SettingDispatchContext = (_a = ContextProvider_1.generateContext(exports.settingReducer, exports.initialSettingState), _a.DispatchContext), exports.SettingContext = _a.StateContext, exports.SettingContextProvider = _a.ContextProvider;

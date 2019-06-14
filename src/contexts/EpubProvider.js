"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PagingContext_1 = require("./PagingContext");
var StatusContext_1 = require("./StatusContext");
var SettingContext_1 = require("./SettingContext");
var React = require("react");
var EpubService_1 = require("../EpubService");
var EpubContextInitializer = function (_a) {
    var children = _a.children;
    var dispatchSetting = React.useContext(SettingContext_1.SettingDispatchContext);
    var dispatchStatus = React.useContext(StatusContext_1.StatusDispatchContext);
    var dispatchPaging = React.useContext(PagingContext_1.PagingDispatchContext);
    EpubService_1.default.init(dispatchSetting, dispatchStatus, dispatchPaging);
    return React.createElement(React.Fragment, null, children);
};
exports.EpubContextProvider = function (_a) {
    var children = _a.children;
    return (React.createElement(SettingContext_1.SettingContextProvider, null,
        React.createElement(PagingContext_1.PagingContextProvider, null,
            React.createElement(StatusContext_1.StatusContextProvider, null,
                React.createElement(EpubContextInitializer, null, children)))));
};

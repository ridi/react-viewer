"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var core_1 = require("@emotion/core");
var React = require("react");
var contexts_1 = require("../../contexts");
var SettingUtil_1 = require("../../SettingUtil");
var Events_1 = require("../../Events");
var ReaderJsHelper_1 = require("../../ReaderJsHelper");
var EpubService_1 = require("../../EpubService");
var styles = require("./styles");
var EpubReader = function () {
    var contentRef = React.useRef(null);
    var _a = React.useState(''), content = _a[0], setContent = _a[1];
    var pagingState = React.useContext(contexts_1.PagingContext);
    var settingState = React.useContext(contexts_1.SettingContext);
    var statusState = React.useContext(contexts_1.StatusContext);
    var setSpineContent = function (spines) { return setContent(spines.join('')); };
    React.useEffect(function () {
        if (contentRef.current) {
            ReaderJsHelper_1.default.mount(contentRef.current, SettingUtil_1.isScroll(settingState));
        }
        Events_1.default.on(Events_1.SET_CONTENT, setSpineContent);
        return function () {
            Events_1.default.off(Events_1.SET_CONTENT, setSpineContent);
        };
    }, []);
    React.useEffect(function () {
        var invalidate = function () { return EpubService_1.default.invalidate(pagingState.currentPage, SettingUtil_1.isScroll(settingState), SettingUtil_1.columnGap(settingState)); };
        var updateCurrent = function () {
            if (!statusState.startToRead)
                return;
            EpubService_1.default.updateCurrent(pagingState.pageUnit, SettingUtil_1.isScroll(settingState));
        };
        window.addEventListener('resize', invalidate);
        window.addEventListener('scroll', updateCurrent);
        return function () {
            window.removeEventListener('resize', invalidate);
            window.removeEventListener('scroll', updateCurrent);
        };
    }, [settingState, pagingState, statusState]);
    React.useEffect(function () {
        if (contentRef.current) {
            ReaderJsHelper_1.default.mount(contentRef.current, SettingUtil_1.isScroll(settingState));
        }
        EpubService_1.default.invalidate(pagingState.currentPage, SettingUtil_1.isScroll(settingState), SettingUtil_1.columnGap(settingState));
    }, [settingState]);
    return (core_1.jsx("div", { css: styles.wrapper(settingState), ref: contentRef, dangerouslySetInnerHTML: { __html: content } }));
};
exports.default = EpubReader;

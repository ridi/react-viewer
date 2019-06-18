"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var React = require("react");
var core_1 = require("@emotion/core");
var contexts_1 = require("../../contexts");
var styles = require("./styles");
var Loading = function () {
    var statusContext = React.useContext(contexts_1.EpubStatusContext);
    console.log("startToRead: " + statusContext.startToRead);
    if (statusContext.startToRead)
        return null;
    return (core_1.jsx("div", { css: styles.wrapper }, "Loading..."));
};
exports.default = Loading;

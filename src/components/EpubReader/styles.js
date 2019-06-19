"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@emotion/core");
var util_1 = require("../../utils/Util");
var index_1 = require("../../contexts/index");
var SettingUtil = require("../../utils/EpubSettingUtil");
exports.wrapper = function (setting) {
    if (setting.viewType === index_1.ViewType.SCROLL) {
        return core_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
    }
    var columnGap = SettingUtil.columnGap(setting);
    var columnsInPage = SettingUtil.columnsInPage(setting);
    return core_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    -webkit-column-width: ", "px;\n    -webkit-column-gap: ", "px;\n    height: ", "px;\n    \n    article {\n      -webkit-column-break-before: always;\n      break-before: column;\n    }\n  "], ["\n    -webkit-column-width: ", "px;\n    -webkit-column-gap: ", "px;\n    height: ", "px;\n    \n    article {\n      -webkit-column-break-before: always;\n      break-before: column;\n    }\n  "])), (util_1.getClientWidth() - (columnGap * (columnsInPage - 1))) / columnsInPage, columnGap, util_1.getClientHeight());
};
var templateObject_1, templateObject_2;

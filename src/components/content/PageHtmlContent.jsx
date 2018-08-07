/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';
import Connector from '../../util/connector/index';

export default class PageHtmlContent extends BaseHtmlContent {
  moveToOffset(offsetInSpine) {
    if (this.wrapper.current) {
      this.wrapper.current.scrollLeft = offsetInSpine
        * (Connector.setting.getContainerWidth() + Connector.setting.getColumnGap());
    }
  }
}

PageHtmlContent.defaultProps = {
  ...BaseHtmlContent.defaultProps,
};

PageHtmlContent.propTypes = {
  ...BaseHtmlContent.propTypes,
};

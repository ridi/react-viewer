/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';
import Connector from '../../util/connector';

export default class PageHtmlContent extends BaseHtmlContent {
  moveToOffset() {
    const { localOffset } = this.props;
    if (this.wrapper.current && localOffset >= 0) {
      this.wrapper.current.scrollLeft = localOffset
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

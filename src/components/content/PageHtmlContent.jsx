/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';
import Connector from '../../util/connector/index';

export default class PageHtmlContent extends BaseHtmlContent {
  moveToOffset(offsetInSpine) {
    if (this.wrapper.current) {
      const { columnGap } = this.props.setting;
      this.wrapper.current.scrollLeft = offsetInSpine * (Connector.setting.getContainerWidth() + columnGap);
    }
  }
}

PageHtmlContent.defaultProps = {
  ...BaseHtmlContent.defaultProps,
};

PageHtmlContent.propTypes = {
  ...BaseHtmlContent.propTypes,
};

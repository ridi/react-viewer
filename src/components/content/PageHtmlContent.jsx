/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';
import Connector from '../../service/connector';

class PageHtmlContent extends BaseHtmlContent {
  moveToOffset() {
    const { localOffset } = this.props;
    if (this.contentWrapperRef.current && localOffset >= 0) {
      this.contentWrapperRef.current.scrollLeft = localOffset
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

export default PageHtmlContent;

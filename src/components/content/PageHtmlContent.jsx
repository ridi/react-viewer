/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';
import Connector from '../../service/connector';

class PageHtmlContent extends BaseHtmlContent {
  moveToOffset() {
    const { localOffset, forwardedRef } = this.props;
    if (forwardedRef.current && localOffset >= 0) {
      forwardedRef.current.scrollLeft = localOffset
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

export default React.forwardRef((props, ref) => <PageHtmlContent forwardedRef={ref} {...props} />);

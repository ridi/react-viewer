import React from 'react';
import BaseHtmlContent from './BaseHtmlContent';
import { screenHeight } from '../../util/BrowserWrapper';

export default class PageHtmlContent extends BaseHtmlContent {
  getHeight() {
    const { containerVerticalMargin } = this.props;
    return `${screenHeight() - (containerVerticalMargin * 2)}px`;
  }

  moveToOffset(offsetInSpine) {
    const { width } = this.props;
    if (this.wrapper.current) {
      const { columnGap } = this.props.setting;
      this.wrapper.current.scrollLeft = offsetInSpine * (width + columnGap);
    }
  }
}

PageHtmlContent.defaultProps = {
  ...BaseHtmlContent.defaultProps,
};

PageHtmlContent.propTypes = {
  ...BaseHtmlContent.propTypes,
};

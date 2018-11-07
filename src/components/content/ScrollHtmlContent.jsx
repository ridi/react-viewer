/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';

class ScrollHtmlContent extends BaseHtmlContent {}

ScrollHtmlContent.defaultProps = {
  ...BaseHtmlContent.defaultProps,
};

ScrollHtmlContent.propTypes = {
  ...BaseHtmlContent.propTypes,
};

export default React.forwardRef((props, ref) => <ScrollHtmlContent forwardedRef={ref} {...props} />);

/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';

class PageHtmlContent extends BaseHtmlContent {
}

PageHtmlContent.defaultProps = BaseHtmlContent.defaultProps;

PageHtmlContent.propTypes = BaseHtmlContent.propTypes;

export default React.forwardRef((props, ref = React.createRef()) => <PageHtmlContent forwardedRef={ref} {...props} />);

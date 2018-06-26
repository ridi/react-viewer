import React from 'react';
import BaseHtmlContent from './BaseHtmlContent';

export default class ScrollHtmlContent extends BaseHtmlContent {}

ScrollHtmlContent.defaultProps = {
  ...BaseHtmlContent.defaultProps,
};

ScrollHtmlContent.propTypes = {
  ...BaseHtmlContent.propTypes,
};

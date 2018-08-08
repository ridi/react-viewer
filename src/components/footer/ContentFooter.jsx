import React from 'react';
import PropTypes from 'prop-types';

const ContentFooter = ({ content }) => <div className="content_footer">{content}</div>;
export default ContentFooter;

ContentFooter.propTypes = {
  content: PropTypes.node.isRequired,
};

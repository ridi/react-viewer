import React from 'react';
import PropTypes from 'prop-types';


const ViewerFooterTabbar = props => (
  <div className="viewer_footer_tabbar">
    {props.children}
  </div>
);

ViewerFooterTabbar.propTypes = {
  children: PropTypes.node,
};

ViewerFooterTabbar.defaultProps = {
  children: null,
};

export default ViewerFooterTabbar;

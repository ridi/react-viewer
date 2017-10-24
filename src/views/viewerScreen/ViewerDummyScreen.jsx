import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { preventScrollEvent } from '../../util/CommonUi';


export default class ViewerDummyScreen extends Component {
  render() {
    const { children } = this.props;

    return (
      <div
        className="viewer_dummy_body"
        ref={(refs) => {
          preventScrollEvent(refs);
        }}
      >
        {children}
      </div>
    );
  }
}

ViewerDummyScreen.propTypes = {
  children: PropTypes.node,
};

import React, { Component } from 'react';
import { preventScrollEvent } from '../../util/CommonUi';


export default class ViewerDummyScreen extends Component {
  render() {
    const { children } = this.props;

    return (
      <div
        className="viewer_dummy_body"
        ref={refs => {
          preventScrollEvent(refs);
        }}
      >
        {children}
      </div>
    );
  }
}

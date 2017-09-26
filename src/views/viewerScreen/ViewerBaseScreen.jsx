import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VIEWER_EMPTY_READ_POSITION } from '../../constants/ViewerScreenConstants';
import { isExist } from '../../util/Util';


export default class ViewerBaseScreen extends Component {
  pageViewStyle() {
  }

  checkEmptyPosition() {
    const { readPosition } = this.props;
    return (readPosition === VIEWER_EMPTY_READ_POSITION || !isExist(readPosition));
  }
}

ViewerBaseScreen.propTypes = {
  readPosition: PropTypes.string
};

ViewerBaseScreen.defaultProps = {
  readPosition: VIEWER_EMPTY_READ_POSITION
};

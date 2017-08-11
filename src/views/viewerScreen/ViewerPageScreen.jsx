import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ViewerBasePageScreen, { mapDispatchToProps, mapStateToProps } from './ViewerBasePageScreen';
import ViewerHelper from '../../util/viewerScreen/ViewerHelper';

class ViewerPageScreen extends ViewerBasePageScreen {
  pageViewStyle() {
    const { paddingLevel } = this.props.viewerScreenSettings;
    return ViewerHelper.getPageStyle(paddingLevel);
  }
}

ViewerPageScreen.propTypes = {
  isEndingScreen: PropTypes.bool,
  pageViewPagination: PropTypes.object,
  viewerScreenTouched: PropTypes.func,
  movePageViewer: PropTypes.func,
  showCommentArea: PropTypes.func,
  isDisableComment: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(ViewerPageScreen);

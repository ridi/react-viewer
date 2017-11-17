import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectIsFullScreen,
  selectPageViewPagination,
} from '../../redux/viewerScreen/ViewerScreen.selector';
import { preventScrollEvent, removeScrollEvent } from '../../util/CommonUi';
import PageCalculator from '../../util/viewerScreen/PageCalculator';


class PageTouchable extends Component {
  onTouchScreenHandle(e) {
    const xPos = e.nativeEvent.pageX;
    const width = document.body.clientWidth;

    const {
      isFullScreen, onLeftTouched, onRightTouched, onMiddleTouched, pagination,
    } = this.props;

    if (PageCalculator.isEndingPage(pagination.currentPage)) {
      return;
    }

    if (!isFullScreen) {
      onMiddleTouched();
      return;
    }

    if (xPos < width * 0.25) {
      onLeftTouched();
    } else if (xPos > width * 0.75) {
      onRightTouched();
    } else {
      onMiddleTouched();
    }
  }

  render() {
    const {
      children,
      contentType,
      footer,
      pagination,
      TouchableScreen,
      SizingWrapper,
      viewerType,
    } = this.props;

    const isEndingScreen = PageCalculator.isEndingPage(pagination.currentPage);

    return (
      <TouchableScreen
        innerRef={(pages) => {
          if (isEndingScreen) {
            removeScrollEvent(pages);
          } else {
            preventScrollEvent(pages);
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onTouchScreenHandle(e);
        }}
      >
        {isEndingScreen && footer ? footer : null}
        <SizingWrapper
          contentType={contentType}
          viewerType={viewerType}
        >
          {children}
        </SizingWrapper>
      </TouchableScreen>
    );
  }
}

PageTouchable.propTypes = {
  onLeftTouched: PropTypes.func,
  onRightTouched: PropTypes.func,
  onMiddleTouched: PropTypes.func,
  contentType: PropTypes.number,
  viewerType: PropTypes.number,
  footer: PropTypes.node,
  pagination: PropTypes.shape({ currentPage: PropTypes.number }),
  isFullScreen: PropTypes.bool,
  children: PropTypes.node,
  TouchableScreen: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  SizingWrapper: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

const mapStateToProps = state => ({
  pagination: selectPageViewPagination(state),
  isFullScreen: selectIsFullScreen(state),
});

export default connect(mapStateToProps)(PageTouchable);

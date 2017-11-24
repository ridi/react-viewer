import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectIsFullScreen,
  selectPageViewPagination,
} from '../../redux/viewerScreen/ViewerScreen.selector';
import { preventScrollEvent, removeScrollEvent } from '../../util/CommonUi';
import PageCalculator from '../../util/viewerScreen/PageCalculator';
import { documentClientWidth } from '../../util/BrowserWrapper';


class PageTouchable extends Component {
  onTouchScreenHandle(e) {
    const xPos = e.clientX;
    const width = documentClientWidth();

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
      <div>
        {
          // As the page movement method is changed from css translate to scroll control,
          // a fixed touchable area that doesn't move away according to scrolled position is needed,
          // so that `TouchableScreen` cannot maintain the form of wrapping the `SizingWrapper` no more.
        }
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
        </TouchableScreen>
        <SizingWrapper
          contentType={contentType}
          viewerType={viewerType}
        >
          {children}
        </SizingWrapper>
      </div>
    );
  }
}

PageTouchable.propTypes = {
  onLeftTouched: PropTypes.func,
  onRightTouched: PropTypes.func,
  onMiddleTouched: PropTypes.func,
  contentType: PropTypes.number,
  viewerType: PropTypes.string,
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

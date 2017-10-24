import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectIsEndingScreen, selectIsFullScreen } from '../../redux/viewerScreen/ViewerScreen.selector';
import { PageScreen, SizingWrapper } from '../../styled/viewerScreen/ViewerScreen.styled';
import { preventScrollEvent, removeScrollEvent } from '../../util/CommonUi';


class PageTouchable extends Component {
  onTouchScreenHandle(e) {
    const xPos = e.nativeEvent.pageX;
    const width = document.body.clientWidth;

    const {
      isEndingScreen, isFullScreen, onLeftTouched, onRightTouched, onMiddleTouched,
    } = this.props;

    if (isEndingScreen) {
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
      children, contentType, footer, isEndingScreen,
    } = this.props;

    return (
      <PageScreen
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
        <SizingWrapper contentType={contentType}>
          {children}
        </SizingWrapper>
      </PageScreen>
    );
  }
}

PageTouchable.propTypes = {
  onLeftTouched: PropTypes.func,
  onRightTouched: PropTypes.func,
  onMiddleTouched: PropTypes.func,
  contentType: PropTypes.number,
  footer: PropTypes.node,
  isEndingScreen: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  isEndingScreen: selectIsEndingScreen(state),
  isFullScreen: selectIsFullScreen(state),
});

export default connect(mapStateToProps)(PageTouchable);

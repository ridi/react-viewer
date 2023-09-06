/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pageDown, pageUp } from '../../util/CommonUi';
import ScrollTouchable from './ScrollTouchable';
import { renderImageOnErrorPlaceholder } from '../../util/DomHelper';
import {
  selectContentType,
  selectIsLoadingCompleted,
  selectSpines,
  selectImages,
  selectContentFormat,
  selectViewerReadPosition,
  selectViewerScreenSettings,
} from '../../redux/viewerScreen/ViewerScreen.selector';
import ViewerHelper from '../../util/viewerScreen/ViewerHelper';
import ReadPositionHelper from '../../util/viewerScreen/ReadPositionHelper';
import ViewerBaseScreen from './ViewerBaseScreen';
import {
  onViewerScreenScrolled,
  onViewerScreenTouched,
} from '../../redux/viewerScreen/ViewerScreen.action';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { redux5InteropRequired, throttle } from '../../util/Util';
import {
  documentAddEventListener,
  documentRemoveEventListener,
} from '../../util/BrowserWrapper';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { SCROLL_VIEWER_SELECTOR } from '../../constants/StyledConstants';

class ViewerScrollScreen extends ViewerBaseScreen {
  componentDidMount() {
    ReadPositionHelper.setScreenElement(document.querySelector(SCROLL_VIEWER_SELECTOR));
    ReadPositionHelper.restorePosition();
    this.addScrollEvent();
    this.changeErrorImage();
  }

  componentWillUnmount() {
    this.removeScrollEvent();
  }

  changeErrorImage() {
    const images = document.getElementsByTagName('img');
    const errorImage = renderImageOnErrorPlaceholder();
    if (images.length <= 0) {
      return;
    }
    for (let idx = 0; idx < images.length; idx += 1) {
      images[idx].addEventListener(DOMEventConstants.ERROR, (e) => {
        e.target.parentNode.replaceChild(errorImage, e.target);
      });
    }
  }

  moveNextPage() {
    pageDown();
  }

  movePrevPage() {
    pageUp();
  }

  pageViewStyle() {
    return ViewerHelper.getScrollStyle();
  }

  addScrollEvent() {
    this.viewerScrollCallback = throttle(e => this.onScrollHandle(e), DOMEventDelayConstants.SCROLL, true);
    documentAddEventListener(DOMEventConstants.SCROLL, this.viewerScrollCallback);
  }

  removeScrollEvent() {
    if (this.viewerScrollCallback) {
      documentRemoveEventListener(DOMEventConstants.SCROLL, this.viewerScrollCallback);
      this.viewerScrollCallback = undefined;
    }
  }

  onScrollHandle(e) {
    e.preventDefault();
    e.stopPropagation();

    const { ignoreScroll, viewerScreenScrolled } = this.props;
    if (ignoreScroll) {
      return;
    }
    viewerScreenScrolled();
    ReadPositionHelper.updateChangedReadPosition();
  }

  render() {
    const {
      contentType,
      viewerScreenTouched,
      isLoadingCompleted,
      footer,
      contentFooter,
      fontDomain,
      TouchableScreen,
      StyledContents,
      SizingWrapper,
    } = this.props;
    const {
      colorTheme,
      font,
      fontSizeLevel,
      paddingLevel,
      lineHeightLevel,
      contentWidthLevel,
      viewerType,
    } = this.props.viewerScreenSettings;

    if (!isLoadingCompleted) {
      return null;
    }

    return (
      <ScrollTouchable
        onTouched={() => viewerScreenTouched()}
        contentType={contentType}
        viewerType={viewerType}
        footer={footer}
        TouchableScreen={TouchableScreen}
        SizingWrapper={SizingWrapper}
      >
        <StyledContents
          id="viewer_contents"
          contentType={contentType}
          className={colorTheme}
          fontSizeLevel={fontSizeLevel}
          fontFamily={font}
          lineHeight={lineHeightLevel}
          comicWidthLevel={contentWidthLevel}
          paddingLevel={paddingLevel}
          fontDomain={fontDomain}
        >
          <div className="pages" style={this.pageViewStyle()}>
            {this.renderContent()}
            {contentFooter && <div className="content_footer" style={this.contentFooterStyle()}>{contentFooter}</div>}
          </div>
        </StyledContents>
      </ScrollTouchable>
    );
  }
}

ViewerScrollScreen.propTypes = {
  viewerScreenSettings: PropTypes.object,
  viewerScreenTouched: PropTypes.func,
  viewerScreenScrolled: PropTypes.func,
  isDisableComment: PropTypes.bool,
  readPosition: PropTypes.string,
  footer: PropTypes.node,
  contentFooter: PropTypes.node,
  fontDomain: PropTypes.string,
  ignoreScroll: PropTypes.bool,
  screenRef: PropTypes.func,
  TouchableScreen: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  StyledContents: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  SizingWrapper: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

const mapStateToProps = state => ({
  spines: selectSpines(state),
  images: selectImages(state),
  contentFormat: selectContentFormat(state),
  contentType: selectContentType(state),
  viewerScreenSettings: selectViewerScreenSettings(state),
  isLoadingCompleted: selectIsLoadingCompleted(state),
  readPosition: selectViewerReadPosition(state),
});

const mapDispatchToProps = dispatch => ({
  viewerScreenTouched: () => dispatch(onViewerScreenTouched()),
  viewerScreenScrolled: () => dispatch(onViewerScreenScrolled()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  redux5InteropRequired() ? { withRef: true } : { forwardRef: true },
)(ViewerScrollScreen);

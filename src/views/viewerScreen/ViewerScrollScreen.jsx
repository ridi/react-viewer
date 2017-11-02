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
  selectViewerReadPosition,
  selectViewerScreenSettings,
} from '../../redux/viewerScreen/ViewerScreen.selector';
import ViewerHelper from '../../util/viewerScreen/ViewerHelper';
import ReadPositionHelper from '../../util/viewerScreen/ReadPositionHelper';
import ViewerBaseScreen from './ViewerBaseScreen';
import { onViewerScreenScrolled, onViewerScreenTouched } from '../../redux/viewerScreen/ViewerScreen.action';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { debounce, isExist } from '../../util/Util';
import { documentAddEventListener, documentRemoveEventListener, setScrollTop } from '../../util/BrowserWrapper';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';


class ViewerScrollScreen extends ViewerBaseScreen {
  componentDidMount() {
    this.restorePosition();
    this.addScrollEvent();
    this.changeErrorImage();
  }

  restorePosition() {
    const { readPosition } = this.props;

    if (this.checkEmptyPosition()) {
      return;
    }

    const offset = ReadPositionHelper.getOffsetByNodeLocation(readPosition);
    if (isExist(offset)) {
      setScrollTop(offset);
    }
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
    this.viewerScrollCallback = debounce(e => this.onScrollHandle(e), DOMEventDelayConstants.SCROLL);
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
    ReadPositionHelper.dispatchChangedReadPosition();
  }

  onScreenRef(ref) {
    const { screenRef } = this.props;
    if (isExist(screenRef)) {
      screenRef(ref);
    }
  }

  render() {
    const {
      contentType,
      viewerScreenTouched,
      spines,
      isLoadingCompleted,
      footer,
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
    } = this.props.viewerScreenSettings;

    if (!isLoadingCompleted) {
      return null;
    }
    let viewData = '';
    Object.keys(spines).forEach((value, index) => { viewData = `${viewData} ${spines[index]}`; });

    return (
      <ScrollTouchable
        onTouched={() => viewerScreenTouched()}
        contentType={contentType}
        footer={footer}
        TouchableScreen={TouchableScreen}
        SizingWrapper={SizingWrapper}
      >
        <StyledContents
          id="contents"
          contentType={contentType}
          className={colorTheme}
          fontSizeLevel={fontSizeLevel}
          fontFamily={font}
          lineHeight={lineHeightLevel}
          comicWidthLevel={contentWidthLevel}
          paddingLevel={paddingLevel}
          fontDomain={fontDomain}
        >
          <div
            dangerouslySetInnerHTML={{ __html: viewData }}
            ref={(screen) => { this.onScreenRef(screen); }}
            style={this.pageViewStyle()}
          />
        </StyledContents>
      </ScrollTouchable>
    );
  }
}

ViewerScrollScreen.propTypes = {
  viewerScreenSettings: PropTypes.object,
  viewerScreenTouched: PropTypes.func,
  viewerScreenScrolled: PropTypes.func,
  readPosition: PropTypes.string,
  footer: PropTypes.node,
  fontDomain: PropTypes.string,
  ignoreScroll: PropTypes.bool,
  screenRef: PropTypes.func,
  TouchableScreen: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]).isRequired,
  StyledContents: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]).isRequired,
  SizingWrapper: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]).isRequired,
};

const mapStateToProps = state => ({
  spines: selectSpines(state),
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
  { withRef: true },
)(ViewerScrollScreen);

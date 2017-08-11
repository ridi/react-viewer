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
  selectViewerScreenSettings
} from '../../redux/viewerScreen/ViewerScreen.selector';
import { ScrollContents } from '../../styled/viewerScreen/ViewerScreen.styled';
import ViewerHelper from '../../util/viewerScreen/ViewerHelper';
import ViewerBaseScreen from './ViewerBaseScreen';
import { onViewerScreenScrolled, onViewerScreenTouched } from '../../redux/viewerScreen/ViewerScreen.action';
import DOMEventConstants from '../../constants/DOMEventConstants';


class ViewerScrollScreen extends ViewerBaseScreen {
  componentDidMount() {
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
      images[idx].addEventListener(DOMEventConstants.ERROR, e => {
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
    // ayon: 어째서인지 컴포넌트에 스크롤 이벤트를 걸면 걸리지 않는다.
    this.viewerScrollCallback = e => this.onScrollHandle(e);
    document.addEventListener(DOMEventConstants.SCROLL, this.viewerScrollCallback);
  }

  removeScrollEvent() {
    if (this.viewerScrollCallback) {
      document.removeEventListener(DOMEventConstants.SCROLL, this.viewerScrollCallback);
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
  }

  render() {
    const {
      contentType,
      viewerScreenTouched,
      spines,
      isLoadingCompleted,
      footer,
      fontDomain,
    } = this.props;
    const {
      colorTheme,
      font,
      fontSizeLevel,
      paddingLevel,
      lineHeightLevel,
      contentWidthLevel
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
      >
        <ScrollContents
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
            style={this.pageViewStyle()}
          />
        </ScrollContents>
      </ScrollTouchable>
    );
  }
}

ViewerScrollScreen.propTypes = {
  viewerScreenSettings: PropTypes.object,
  viewerScreenTouched: PropTypes.func,
  viewerScreenScrolled: PropTypes.func,
  footer: PropTypes.node,
  fontDomain: PropTypes.string,
  ignoreScroll: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  spines: selectSpines(state),
  contentType: selectContentType(state),
  viewerScreenSettings: selectViewerScreenSettings(state),
  isLoadingCompleted: selectIsLoadingCompleted(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  viewerScreenTouched: () => dispatch(onViewerScreenTouched()),
  viewerScreenScrolled: () => dispatch(onViewerScreenScrolled()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(ViewerScrollScreen);

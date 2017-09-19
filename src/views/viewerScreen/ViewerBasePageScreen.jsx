import React from 'react';
import PropTypes from 'prop-types';
import {
  movePageViewer as movePageViewerAction,
  onViewerScreenTouched,
  showCommentArea as showCommentAreaAction
} from '../../redux/viewerScreen/ViewerScreen.action';
import { BindingType } from '../../constants/ContentConstants';
import { isExist } from '../../util/Util';
import PageCalculator from '../../util/viewerScreen/PageCalculator';
import PageTouchable from './PageTouchable';
import { PageContents, Pages } from '../../styled/viewerScreen/ViewerScreen.styled';
import { renderImageOnErrorPlaceholder } from '../../util/DomHelper';
import AsyncTask from '../../util/AsyncTask';
import {
  selectBindingType,
  selectContentType,
  selectIsEndingScreen,
  selectIsLoadingCompleted,
  selectPageViewPagination,
  selectSpines,
  selectViewerScreenSettings
} from '../../redux/viewerScreen/ViewerScreen.selector';
import ViewerBaseScreen from './ViewerBaseScreen';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { preventScrollEvent, removeScrollEvent } from '../../util/CommonUi';
import { setScrollTop } from '../../util/BrowserWrapper';


class ViewerBasePageScreen extends ViewerBaseScreen {
  constructor() {
    super();
    this.resizeViewerFunc = this.resizeViewer.bind(this);
  }

  componentDidMount() {
    const { isEndingScreen } = this.props;
    if (isEndingScreen) {
      return;
    }
    this.updatePagination();
    this.changeErrorImage();
  }

  componentWillUnmount() {
    this.removeScrollEvent();
  }

  componentWillReceiveProps(nextProps) {
    const nextPage = nextProps.pageViewPagination.currentPage;
    if (nextPage !== this.props.pageViewPagination.currentPage) {
      setScrollTop(0);
      this.updatePagination();
    }
    if (!nextProps.isEndingScreen && this.props.isEndingScreen) {
      this.updatePagination();
    }
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

  updatePagination() {
    new AsyncTask(() => {
      setScrollTop(0);
      PageCalculator.updatePagination();
    }).start(300);
  }

  resizeViewer(width) {
    this.updatePagination();
  }

  preventScrollEvent(ref) {
    preventScrollEvent(ref);
    if (isExist(ref)) {
      window.addEventListener(DOMEventConstants.RESIZE, this.resizeViewerFunc);
    }
  }

  removeScrollEvent(ref) {
    removeScrollEvent(ref);
    if (isExist(ref)) {
      window.removeEventListener(DOMEventConstants.RESIZE, this.resizeViewerFunc);
    }
  }

  moveNextPage() {
    const { movePageViewer, pageViewPagination, showCommentArea } = this.props;
    const { currentPage, totalPage } = pageViewPagination;

    const nextPage = currentPage + 1;
    if (nextPage > totalPage) {
      return;
    }
    movePageViewer(nextPage);


    if (PageCalculator.isEndingPage(nextPage, totalPage)) {
      showCommentArea();
    }
  }

  movePrevPage() {
    const { onMoveWrongDirection, bindingType, movePageViewer, pageViewPagination } = this.props;
    const { currentPage } = pageViewPagination;
    const nextPage = currentPage - 1;
    if (nextPage <= 0) {
      if (bindingType === BindingType.RIGHT && isExist(onMoveWrongDirection)) {
        onMoveWrongDirection();
      }
      return;
    }
    movePageViewer(nextPage);
  }

  onScreenRef(ref) {
    const { screenRef } = this.props;
    if (isExist(screenRef)) {
      screenRef(ref);
    }
  }

  onLeftTouched() {
    const { bindingType } = this.props;
    if (bindingType === BindingType.RIGHT) {
      this.moveNextPage();
    } else {
      this.movePrevPage();
    }
  }

  onRightTouched() {
    const { bindingType } = this.props;
    if (bindingType === BindingType.RIGHT) {
      this.movePrevPage();
    } else {
      this.moveNextPage();
    }
  }

  render() {
    const {
      contentType,
      spines,
      isLoadingCompleted,
      viewerScreenTouched,
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
    Object.keys(spines).forEach((value, index) => {
      viewData = `${viewData} ${spines[index]}`;
    });

    return (
      <PageTouchable
        onLeftTouched={() => this.onLeftTouched()}
        onRightTouched={() => this.onRightTouched()}
        onMiddleTouched={() => viewerScreenTouched()}
        contentType={contentType}
        footer={footer}
      >
        <PageContents
          id="viewer_page_contents"
          content={contentType}
          className={colorTheme}
          fontSizeLevel={fontSizeLevel}
          fontFamily={font}
          lineHeight={lineHeightLevel}
          comicWidthLevel={contentWidthLevel}
          paddingLevel={paddingLevel}
          contentType={contentType}
          innerRef={pages => { this.preventScrollEvent(pages); }}
          fontDomain={fontDomain}
        >
          <Pages
            className="pages"
            dangerouslySetInnerHTML={{ __html: viewData }}
            style={this.pageViewStyle()}
            innerRef={pages => {
              this.onScreenRef(pages);
              this.preventScrollEvent(pages);
            }}
          />
        </PageContents>
      </PageTouchable>
    );
  }
}

ViewerBasePageScreen.propTypes = {
  onMoveWrongDirection: PropTypes.func,
  isEndingScreen: PropTypes.bool,
  pageViewPagination: PropTypes.object,
  viewerScreenTouched: PropTypes.func,
  movePageViewer: PropTypes.func,
  showCommentArea: PropTypes.func,
  isDisableComment: PropTypes.bool,
  footer: PropTypes.node,
  screenRef: PropTypes.func,
  fontDomain: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  viewerScreenSettings: selectViewerScreenSettings(state),
  contentType: selectContentType(state),
  bindingType: selectBindingType(state),
  pageViewPagination: selectPageViewPagination(state),
  spines: selectSpines(state),
  isEndingScreen: selectIsEndingScreen(state),
  isLoadingCompleted: selectIsLoadingCompleted(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  viewerScreenTouched: () => dispatch(onViewerScreenTouched()),
  movePageViewer: number => dispatch(movePageViewerAction(number)),
  showCommentArea: () => {
    const { isDisableComment = false } = ownProps;
    if (isDisableComment) {
      return; // 매니져뷰어에서는 사용하지 않음
    }
    dispatch(showCommentAreaAction());
  }
});

export default ViewerBasePageScreen;
export { mapStateToProps, mapDispatchToProps };

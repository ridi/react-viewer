import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ViewerType } from '../../constants/ViewerScreenConstants';
import { AvailableViewerType, ContentType } from '../../constants/ContentConstants';
import ViewerPageScreen from './ViewerPageScreen';
import ViewerScrollScreen from './ViewerScrollScreen';
import ViewerComicPageScreen from './ViewerComicPageScreen';
import ViewerDummyScreen from './ViewerDummyScreen';
import {
  selectContentType,
  selectIsLoadingCompleted,
  selectViewerScreenSettings,
  selectViewerType,
} from '../../redux/viewerScreen/ViewerScreen.selector';
import {
  ScrollScreen as ScrollScreenDefault,
  PageScreen as PageScreenDefault,
  SizingWrapper as SizingWrapperDefault,
  PageContents as PageContentsDefault,
  ScrollContents as ScrollContentsDefault,
} from '../../styled/viewerScreen/ViewerScreen.styled';
import { isExist } from '../../util/Util';

const createStyledViewerScreen = ({
  TouchableScrollScreen = ScrollScreenDefault,
  StyledScrollContents = ScrollContentsDefault,
  TouchablePageScreen = PageScreenDefault,
  StyledPageContents = PageContentsDefault,
  SizingWrapper = SizingWrapperDefault,
} = {}) => {
  class ViewerScreen extends Component {
    constructor() {
      super();
      this.screen = null;
    }

    componentDidMount() {
      const { onMount } = this.props;
      if (isExist(onMount)) {
        onMount();
      }
    }

    componentWillUnmount() {
      const { onUnmount } = this.props;
      if (isExist(onUnmount)) {
        onUnmount();
      }
    }

    getScreen() {
      const { viewerType, isLoadingCompleted } = this.props;

      if (!isLoadingCompleted) {
        return this.renderDummyScreen();
      }

      switch (viewerType) {
        case AvailableViewerType.SCROLL:
          return this.renderScrollView();
        case AvailableViewerType.PAGE:
          return this.renderPageView();
        default:
          // BOTH available
          return this.renderWithSetting();
      }
    }

    restorePosition() {
      if (isExist(this.screen)) {
        this.screen.restorePosition();
      }
    }

    moveNextPage() {
      if (isExist(this.screen)) {
        this.screen.moveNextPage();
      }
    }

    movePrevPage() {
      if (isExist(this.screen)) {
        this.screen.movePrevPage();
      }
    }

    renderScrollView() {
      return this.renderScreen(ViewerScrollScreen, {
        TouchableScreen: TouchableScrollScreen,
        StyledContents: StyledScrollContents,
        SizingWrapper,
      });
    }

    renderPageView() {
      const { contentType } = this.props;

      const components = {
        TouchableScreen: TouchablePageScreen,
        StyledContents: StyledPageContents,
        SizingWrapper,
      };
      if (contentType === ContentType.COMIC) {
        return this.renderScreen(ViewerComicPageScreen, components);
      }
      return this.renderScreen(ViewerPageScreen, components);
    }

    renderWithSetting() {
      const { viewerScreenSettings } = this.props;

      if (viewerScreenSettings.viewerType === ViewerType.SCROLL) {
        return this.renderScrollView();
      }
      return this.renderPageView();
    }

    renderDummyScreen() {
      return (<ViewerDummyScreen {...this.props} />);
    }

    renderScreen(SelectedScreen, components = {}) {
      const {
        onMoveWrongDirection,
        footer,
        fontDomain,
        ignoreScroll,
        disablePageCalculation = false,
      } = this.props;

      return (
        <SelectedScreen
          ref={(screen) => {
            this.screen = screen && screen.getWrappedInstance();
          }}
          onMoveWrongDirection={() => onMoveWrongDirection()}
          footer={footer}
          fontDomain={fontDomain}
          ignoreScroll={ignoreScroll}
          disablePageCalculation={disablePageCalculation}
          {...components}
        />
      );
    }

    render() {
      return (
        <section className="viewer_body">
          {this.getScreen()}
        </section>
      );
    }
  }

  ViewerScreen.propTypes = {
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    onMoveWrongDirection: PropTypes.func,
    footer: PropTypes.node,
    fontDomain: PropTypes.string,
    ignoreScroll: PropTypes.bool,
    isLoadingCompleted: PropTypes.bool,
    viewerScreenSettings: PropTypes.object,
    viewerType: PropTypes.oneOf(AvailableViewerType.toList()),
    contentType: PropTypes.oneOf(ContentType.toList()),
    disablePageCalculation: PropTypes.bool,
  };

  const mapStateToProps = state => ({
    contentType: selectContentType(state),
    viewerType: selectViewerType(state),
    isLoadingCompleted: selectIsLoadingCompleted(state),
    viewerScreenSettings: selectViewerScreenSettings(state),
  });

  return connect(
    mapStateToProps,
    null,
    null,
    { withRef: true },
  )(ViewerScreen);
};

export default createStyledViewerScreen();

export { createStyledViewerScreen };

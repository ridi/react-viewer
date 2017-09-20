import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ViewerType } from '../../constants/ViewerScreenConstants';
import { AvailableViewerType, ContentType } from '../../constants/ContentConstants';
import ReadPositionHelper from '../../util/viewerScreen/ReadPositionHelper';
import ViewerPageScreen from './ViewerPageScreen';
import ViewerScrollScreen from './ViewerScrollScreen';
import ViewerComicPageScreen from './ViewerComicPageScreen';
import ViewerDummyScreen from './ViewerDummyScreen';
import {
  selectContentType,
  selectIsLoadingCompleted,
  selectViewerScreenSettings,
  selectViewerType
} from '../../redux/viewerScreen/ViewerScreen.selector';
import { isExist } from '../../util/Util';


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

  componentDidUpdate() {
    ReadPositionHelper.dispatchChangedReadPosition();
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    if (isExist(onUnmount)) {
      onUnmount();
    }
    ReadPositionHelper.unmountReader();
  }

  getScreen() {
    const { viewerType, isLoadingCompleted } = this.props;

    if (!isLoadingCompleted) {
      return this.renderDummyScreen();
    }

    switch (viewerType) {
      case AvailableViewerType.SCROLL:
        return this.renderScreen(ViewerScrollScreen);
      case AvailableViewerType.PAGE:
        return this.renderPageView();
      default:
        return this.renderWithSetting();
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

  renderPageView() {
    const { contentType } = this.props;

    if (contentType === ContentType.COMIC) {
      return this.renderScreen(ViewerComicPageScreen);
    }
    return this.renderScreen(ViewerPageScreen);
  }

  renderWithSetting() {
    const { viewerScreenSettings } = this.props;

    if (viewerScreenSettings.viewerType === ViewerType.SCROLL) {
      return this.renderScreen(ViewerScrollScreen);
    }
    return this.renderPageView();
  }

  renderDummyScreen() {
    return (<ViewerDummyScreen {...this.props} />);
  }

  renderScreen(SelectedScreen) {
    return (
      <SelectedScreen
        ref={screen => {
          this.screen = screen && screen.getWrappedInstance();
        }}
        screenRef={el => { ReadPositionHelper.setScreenElement(el); }}
        onMoveWrongDirection={() => this.props.onMoveWrongDirection()}
        footer={this.props.footer}
        fontDomain={this.props.fontDomain}
        ignoreScroll={this.props.ignoreScroll}
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
  viewerType: PropTypes.oneOf(ViewerType.toList()),
  contentType: PropTypes.oneOf(ContentType.toList()),
};

const mapStateToProps = (state, ownProps) => ({
  contentType: selectContentType(state),
  viewerType: selectViewerType(state),
  isLoadingCompleted: selectIsLoadingCompleted(state),
  viewerScreenSettings: selectViewerScreenSettings(state),
});

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(ViewerScreen);

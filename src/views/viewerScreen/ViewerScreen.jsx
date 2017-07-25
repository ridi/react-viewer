import React, { Component, PropTypes } from 'react';
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
  selectViewerType
} from '../../redux/viewerScreen/ViewerScreen.selector';


class ViewerScreen extends Component {
  constructor() {
    super();
    this.screen = null;
  }

  componentDidMount() {
    this.props.onMount && this.props.onMount();
  }

  componentWillUnmount() {
    this.props.onUnmount && this.props.onUnmount();
  }

  moveNextPage() {
    this.screen && this.screen.moveNextPage();
  }

  movePrevPage() {
    this.screen && this.screen.movePrevPage();
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
        ref={screen => { this.screen = screen && screen.getWrappedInstance(); }}
        onMoveWrongDirection={() => this.props.onMoveWrongDirection()}
        footer={this.props.footer}
        fontDomain={this.props.fontDomain}
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

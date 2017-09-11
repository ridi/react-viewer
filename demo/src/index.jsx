import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import {
  reducers as viewerScreen,
  selectViewerScreenSettings,
  selectIsFullScreen,
  selectIsLoadingCompleted,
} from '../../lib/index';
import viewer from './redux/Viewer.reducer';
import { ContentType } from '../../src/constants/ContentConstants';
import ViewerHeader from './components/headers/ViewerHeader';
import ViewerDummyBody from './components/bodies/ViewerDummyBody';
import ViewerBody from './components/bodies/ViewerBody';
import ViewerFooter from './components/footers/ViewerFooter';


const rootReducer = combineReducers({
  viewer,
  viewerScreen,
});

const enhancer = applyMiddleware(thunk);

const store = createStore(rootReducer, {}, enhancer);


class DemoViewer extends Component {
  contentTypeClassName() {
    const { content } = this.props;
    switch (content.content_type) {
      case ContentType.COMIC:
        return 'comic_content';
      case ContentType.WEBTOON:
        return 'webtoon_content';
      case ContentType.WEB_NOVEL:
        return 'web_novel_content';
      default:
        return '';
    }
  }

  render() {
    const {
      colorTheme,
      viewerType,
    } = this.props.viewerScreenSettings;
    const {
      content,
      episode,
      isFullScreen,
      isVisibleSettingPopup,
      isLoadingCompleted,
    } = this.props;

    return (
      <section
        id="viewer_page"
        className={`${colorTheme} view_type_${viewerType} ${this.contentTypeClassName()}`}
      >
        <ViewerHeader
          title={content.title}
          isVisible={isFullScreen || isVisibleSettingPopup}
        />
        {isLoadingCompleted ?
          <ViewerBody
            content={content}
            episode={episode}
          /> :
          <ViewerDummyBody />
        }
        <ViewerFooter
          content={content}
          episode={episode}
        />
      </section>
    );
  }
}

DemoViewer.propTypes = {
  content: PropTypes.object.isRequired,
  episode: PropTypes.object.isRequired,
  viewerScreenSettings: PropTypes.object,
  isFullScreen: PropTypes.bool.isRequired,
  isVisibleSettingPopup: PropTypes.bool.isRequired,
};

DemoViewer.defaultProps = {
  viewerScreenSettings: {},
};

const mapStateToProps = state => {
  const { ui } = state.viewer;
  const { isVisibleSettingPopup } = ui;

  return {
    viewerScreenSettings: selectViewerScreenSettings(state),
    isFullScreen: selectIsFullScreen(state),
    isVisibleSettingPopup,
    isLoadingCompleted: selectIsLoadingCompleted(state),
  };
};

const mapDispatchToProps = dispatch => ({
});


const DemoViewerPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DemoViewer);

ReactDOM.render(
  <Provider store={store}>
    <DemoViewerPage
      content={Resources.content}
      episode={Resources.episode}
    />
  </Provider>,
  document.getElementById('app')
);

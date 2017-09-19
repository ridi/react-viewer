import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connect, Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import {
  reducers as viewerScreen,
  selectViewerScreenSettings,
  selectIsFullScreen,
  selectIsLoadingCompleted,
  updateSpineMetaData as updateSpineMetaDataAction,
  ViewerHelper,
  PageCalculator,
  ReadPositionHelper,
} from '../../lib/index';
import viewer from './redux/Viewer.reducer';
import { ContentType, BindingType } from '../../src/constants/ContentConstants';
import ViewerHeader from './components/headers/ViewerHeader';
import ViewerDummyBody from './components/bodies/ViewerDummyBody';
import ViewerBody from './components/bodies/ViewerBody';
import ViewerFooter from './components/footers/ViewerFooter';
import ContentsData from './contents.json';
import { requestLoadEpisode } from './redux/Viewer.action';
import { IconsSprite } from './components/icons/IconsSprite';


const rootReducer = combineReducers({
  viewer,
  viewerScreen,
});


const enhancer = composeWithDevTools(
  applyMiddleware(
    thunk
  ),
);

const store = createStore(rootReducer, {}, enhancer);
ViewerHelper.connect(store);
PageCalculator.connect(store);
ReadPositionHelper.connect(store);

class DemoViewer extends Component {
  componentWillMount() {
    const { content, episode, requestViewerData, updateSpineMetaData } = this.props;

    updateSpineMetaData(content.content_type, content.viewer_type, content.binding_type);
    requestViewerData(content.id, episode.id);
  }

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
          isVisible={!isFullScreen || isVisibleSettingPopup}
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
        <IconsSprite />
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
  isLoadingCompleted: PropTypes.bool.isRequired,
  requestViewerData: PropTypes.func.isRequired,
  updateSpineMetaData: PropTypes.func.isRequired,
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
  requestViewerData: (contentId, episodeId) => dispatch(requestLoadEpisode(contentId, episodeId)),
  updateSpineMetaData: (contentType, viewerType, bindingType = BindingType.LEFT) =>
    dispatch(updateSpineMetaDataAction(contentType, viewerType, bindingType)),
});

const DemoViewerPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DemoViewer);


const { contents, episodes } = ContentsData;
const content = contents[Math.floor(Math.random() * contents.length)];
const episode = episodes[content.id];

ReactDOM.render(
  <Provider store={store}>
    <DemoViewerPage
      content={content}
      episode={episode}
    />
  </Provider>,
  document.getElementById('app')
);

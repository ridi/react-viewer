import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connect, Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import Reader, {
  reducers as reader,
  Connector,
  ContentType,
  AvailableViewType,
  selectReaderCurrentContentIndex,
  updateMetadata,
} from '../../lib';
import viewer from './redux/Viewer.reducer';
import ViewerHeader from './components/headers/ViewerHeader';
import ViewerFooter from './components/footers/ViewerFooter';
import { IconsSprite } from './components/icons/IconsSprite';
import { selectReaderIsFullScreen } from '../../src/redux/selector';
import ViewerScreenFooter from './components/footers/ViewerScreenFooter';
import ContentsData from '../resources/contents/contents.json';
import { requestLoadContent } from './redux/Viewer.action';


const rootReducer = combineReducers({
  viewer,
  reader: reader({
    setting: {
      font: 'kopup_dotum',
      containerHorizontalMargin: 15,
      containerVerticalMargin: 50,
    },
  }),
});

const enhancer = composeWithDevTools(applyMiddleware(thunk));

const store = createStore(rootReducer, {}, enhancer);
Connector.connect(store);

class DemoViewer extends Component {
  componentWillMount() {
    const {
      content, actionRequestLoadContent, actionUpdateMetadata,
    } = this.props;

    actionUpdateMetadata(content.content_type, content.viewer_type, content.binding_type);
    actionRequestLoadContent(content.id);
  }

  render() {
    const {
      isFullScreen,
      content,
      currentContentIndex,
    } = this.props;
    return (
      <section id="viewer_page">
        <ViewerHeader title={content.title} chapter={currentContentIndex} isVisible={!isFullScreen} />
        <Reader
          footer={<ViewerScreenFooter
            content={{ content_type: ContentType.WEB_NOVEL, viewer_type: AvailableViewType.BOTH, title: '테스트' }}
            episode={{ title: content.title }}
          />}
          contentFooter={<small>content footer area...</small>}
          onMoveWrongDirection={() => alert('move to the wrong direction')}
          onMount={() => console.log('onMount')}
          onUnmount={() => console.log('onUnmount')}
        />
        <ViewerFooter content={content} />
        <IconsSprite />
      </section>
    );
  }
}

DemoViewer.propTypes = {
  content: PropTypes.object.isRequired,
  currentContentIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  actionUpdateMetadata: PropTypes.func.isRequired,
  actionRequestLoadContent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { ui } = state.viewer;
  const { isVisibleSettingPopup } = ui;

  return {
    isFullScreen: selectReaderIsFullScreen(state),
    isVisibleSettingPopup,
    currentContentIndex: selectReaderCurrentContentIndex(state),
  };
};

const mapDispatchToProps = dispatch => ({
  actionUpdateMetadata: (contentType, viewType, bindingType) => dispatch(updateMetadata(contentType, viewType, bindingType)),
  actionRequestLoadContent: contentId => dispatch(requestLoadContent(contentId)),
});

const DemoViewerPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DemoViewer);


const { contents } = ContentsData;
const queryParam = new URLSearchParams(window.location.search);

const contentId = queryParam.get('contentId');
const selected = contents.filter(content => content.id.toString() === contentId);
const content = selected.length === 1 ? selected[0] : contents[Math.floor(Math.random() * contents.length)];

ReactDOM.render(
  <Provider store={store}>
    <DemoViewerPage content={content} />
  </Provider>,
  document.getElementById('app'),
);

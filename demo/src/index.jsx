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
  selectReaderCurrentContentIndex,
} from '../../lib';
import viewer from './redux/Viewer.reducer';
import ViewerHeader from './components/headers/ViewerHeader';
import ViewerFooter from './components/footers/ViewerFooter';
import { IconsSprite } from './components/icons/IconsSprite';
import { selectIsFullScreen } from './redux/Viewer.selector';
import ViewerScreenFooter from './components/footers/ViewerScreenFooter';
import ContentsData from '../resources/contents/contents.json';
import { requestLoadContent, onScreenTouched } from './redux/Viewer.action';


const rootReducer = combineReducers({
  viewer,
  reader: reader({
    setting: {
      font: 'kopup_dotum',
      containerHorizontalMargin: 30,
      containerVerticalMargin: 50,
    },
  }),
});

const enhancer = composeWithDevTools(applyMiddleware(thunk));

const store = createStore(rootReducer, {}, enhancer);
Connector.connect(store);

class DemoViewer extends Component {
  componentWillMount() {
    const { content, actionRequestLoadContent } = this.props;
    actionRequestLoadContent(content);
  }

  render() {
    const {
      isFullScreen,
      content,
      currentContentIndex,
      actionOnScreenTouched,
    } = this.props;
    return (
      <section id="viewer_page">
        <ViewerHeader title={content.title} chapter={currentContentIndex} isVisible={!isFullScreen} />
        <Reader
          footer={<ViewerScreenFooter content={content} />}
          contentFooter={<small>content footer area...</small>}
          onMoveWrongDirection={() => alert('move to the wrong direction')}
          onMount={() => console.log('onMount')}
          onUnmount={() => console.log('onUnmount')}
          onTouched={() => actionOnScreenTouched()}
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
  actionRequestLoadContent: PropTypes.func.isRequired,
  actionOnScreenTouched: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { ui } = state.viewer;
  const { isVisibleSettingPopup } = ui;

  return {
    isFullScreen: selectIsFullScreen(state),
    isVisibleSettingPopup,
    currentContentIndex: selectReaderCurrentContentIndex(state),
  };
};

const mapDispatchToProps = dispatch => ({
  actionRequestLoadContent: content => dispatch(requestLoadContent(content)),
  actionOnScreenTouched: () => dispatch(onScreenTouched()),
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

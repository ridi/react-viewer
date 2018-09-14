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
  selectReaderCurrentOffset,
  selectReaderSetting,
  ViewType,
  selectReaderCalculationsTotal,
} from '../../lib';
import viewer from './redux/Viewer.reducer';
import ViewerHeader from './components/headers/ViewerHeader';
import ViewerFooter from './components/footers/ViewerFooter';
import { IconsSprite } from './components/icons/IconsSprite';
import { selectIsFullScreen } from './redux/Viewer.selector';
import ViewerScreenFooter from './components/footers/ViewerScreenFooter';
import ContentsData from '../resources/contents/contents.json';
import { requestLoadContent, onScreenTouched, onScreenScrolled } from './redux/Viewer.action';
import { screenWidth } from './utils/BrowserWrapper';
import { BindingType } from '../../src/constants/ContentConstants';

const Position = {
  LEFT: 1,
  MIDDLE: 2,
  RIGHT: 3,
};


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
  constructor(props) {
    super(props);
    this.onReaderTouched = this.onReaderTouched.bind(this);
    this.onReaderScrolled = this.onReaderScrolled.bind(this);
    this.footer = <ViewerScreenFooter content={props.content} />;
  }

  componentWillMount() {
    const { content, actionRequestLoadContent } = this.props;
    actionRequestLoadContent(content);
  }

  onMoveWrongDirection() {
    alert('move to the wrong direction');
  }

  onPositionTouched(position) {
    const {
      actionOnScreenTouched,
      content,
      currentOffset,
      calculationsTotal,
    } = this.props;

    if (position === Position.MIDDLE) {
      actionOnScreenTouched();
      return;
    }

    if (position === Position.RIGHT
      && content.bindingType === BindingType.RIGHT
      && currentOffset === 0) {
      this.onMoveWrongDirection();
      return;
    }

    let nextOffset = currentOffset;
    if (position === Position.LEFT) {
      nextOffset = content.bindingType === BindingType.LEFT ? currentOffset - 1 : currentOffset + 1;
    } else if (position === Position.RIGHT) {
      nextOffset = content.bindingType === BindingType.LEFT ? currentOffset + 1 : currentOffset - 1;
    }

    nextOffset = Math.max(0, Math.min(nextOffset, calculationsTotal - 1));
    if (currentOffset === nextOffset) return;

    Connector.current.updateCurrentOffset(nextOffset);
  }

  onReaderTouched(event) {
    if (Connector.current.isOnFooter()) return;
    const { setting } = this.props;

    const width = screenWidth();
    let position = Position.MIDDLE;
    if (setting.viewType === ViewType.PAGE) {
      if (event.clientX <= width * 0.2) position = Position.LEFT;
      if (event.clientX >= width * 0.8) position = Position.RIGHT;
    }

    this.onPositionTouched(position);
  }

  onReaderScrolled() {
    const { actionOnScreenScrolled } = this.props;
    actionOnScreenScrolled();
  }

  render() {
    const {
      isFullScreen,
      content,
      currentContentIndex,
      setting,
    } = this.props;
    return (
      <section
        id="viewer_page"
        role="button"
        tabIndex="-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            this.onPositionTouched(Position.MIDDLE);
          } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            this.onPositionTouched(Position.LEFT);
          } else if (e.key === 'ArrowRight' || e.key === 'Right') {
            this.onPositionTouched(Position.RIGHT);
          }
        }}
      >
        <ViewerHeader title={content.title} chapter={currentContentIndex} isVisible={!isFullScreen} />
        <Reader
          footer={this.footer}
          contentFooter={<small>content footer area...</small>}
          onMount={() => console.log('onMount')}
          onUnmount={() => console.log('onUnmount')}
          onTouched={this.onReaderTouched}
          onScrolled={this.onReaderScrolled}
        >
          {setting.viewType === ViewType.PAGE
            && (
              <>
                <button type="button" className="left_button" />
                <button type="button" className="right_button" />
              </>
            )
          }
        </Reader>
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
  actionOnScreenScrolled: PropTypes.func.isRequired,
  currentOffset: PropTypes.number.isRequired,
  setting: PropTypes.object.isRequired,
  calculationsTotal: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  const { ui } = state.viewer;
  const { isVisibleSettingPopup } = ui;

  return {
    isFullScreen: selectIsFullScreen(state),
    isVisibleSettingPopup,
    currentContentIndex: selectReaderCurrentContentIndex(state),
    currentOffset: selectReaderCurrentOffset(state),
    setting: selectReaderSetting(state),
    calculationsTotal: selectReaderCalculationsTotal(state),
  };
};

const mapDispatchToProps = dispatch => ({
  actionRequestLoadContent: content => dispatch(requestLoadContent(content)),
  actionOnScreenTouched: () => dispatch(onScreenTouched()),
  actionOnScreenScrolled: () => dispatch(onScreenScrolled()),
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

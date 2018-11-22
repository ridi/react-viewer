import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connect, Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import {
  reducers as reader,
  Connector,
  selectReaderCurrentOffset,
  selectReaderCalculationsTotal,
} from '@ridi/react-viewer';
import viewer from './redux/Viewer.reducer';
import ViewerHeader from './components/headers/ViewerHeader';
import ViewerFooter from './components/footers/ViewerFooter';
import { IconsSprite } from './components/icons/IconsSprite';
import ContentsData from '../resources/contents/contents.json';
import {
  onScreenTouched,
  onScreenScrolled,
} from './redux/Viewer.action';
import { BindingType } from '../../src/constants/ContentConstants';
import ViewerBody from './components/body/ViewerBody';
import { Position } from './constants/ViewerConstants';

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

class DemoViewer extends React.Component {
  constructor(props) {
    super(props);
    this.cache = null;
    this.onScrolled = this.onScrolled.bind(this);
    this.onTouched = this.onTouched.bind(this);
  }

  onMoveWrongDirection() {
    alert('move to the wrong direction');
  }

  onTouched(position) {
    const {
      actionOnScreenTouched,
      contentMeta,
      currentOffset,
      calculationsTotal,
    } = this.props;

    if (position === Position.MIDDLE) {
      actionOnScreenTouched();
      return;
    }

    if (position === Position.RIGHT
      && contentMeta.bindingType === BindingType.RIGHT
      && currentOffset === 0) {
      this.onMoveWrongDirection();
      return;
    }

    let nextOffset = currentOffset;
    if (position === Position.LEFT) {
      nextOffset = contentMeta.bindingType === BindingType.LEFT ? currentOffset - 1 : currentOffset + 1;
    } else if (position === Position.RIGHT) {
      nextOffset = contentMeta.bindingType === BindingType.LEFT ? currentOffset + 1 : currentOffset - 1;
    }

    nextOffset = Math.max(0, Math.min(nextOffset, calculationsTotal - 1));
    if (currentOffset === nextOffset) return;

    Connector.current.updateCurrentOffset(nextOffset);
  }

  onScrolled() {
    const { actionOnScreenScrolled } = this.props;
    actionOnScreenScrolled();
  }

  render() {
    const {
      contentMeta,
    } = this.props;
    return (
      <section
        id="viewer_page"
        role="button"
        tabIndex="-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            this.onTouched(Position.MIDDLE);
          } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            this.onTouched(Position.LEFT);
          } else if (e.key === 'ArrowRight' || e.key === 'Right') {
            this.onTouched(Position.RIGHT);
          }
        }}
      >
        <ViewerHeader contentMeta={contentMeta} />
        <ViewerBody
          contentMeta={contentMeta}
          onTouched={this.onTouched}
          onScrolled={this.onScrolled}
        />
        <ViewerFooter contentMeta={contentMeta} />
        <IconsSprite />
      </section>
    );
  }
}

DemoViewer.propTypes = {
  contentMeta: PropTypes.object.isRequired,
  actionOnScreenTouched: PropTypes.func.isRequired,
  actionOnScreenScrolled: PropTypes.func.isRequired,
  currentOffset: PropTypes.number.isRequired,
  calculationsTotal: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  isVisibleSettingPopup: state.viewer.ui.isVisibleSettingPopup,
  currentOffset: selectReaderCurrentOffset(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
});

const mapDispatchToProps = dispatch => ({
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
const contentMeta = selected.length === 1 ? selected[0] : contents[Math.floor(Math.random() * contents.length)];

ReactDOM.render(
  <Provider store={store}>
    <DemoViewerPage contentMeta={contentMeta} />
  </Provider>,
  document.getElementById('app'),
);

/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { debounce } from '../../util/Util';
import {
  selectReaderContents,
  selectReaderCurrent,
  selectReaderSetting,
  selectReaderCalculationsTotal, selectReaderContentFormat, selectReaderIsReadyToRead, selectReaderSelection, selectReaderIsContentsLoaded,
} from '../../redux/selector';
import PropTypes, { ContentType, CurrentType, SettingType } from '../prop-types';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { updateContent, updateContentError } from '../../redux/action';
import Connector from '../../service/connector';
import TouchableScreen from './TouchableScreen';
import { addEventListener, removeEventListener } from '../../util/EventHandler';
import { getStyledTouchable } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';
import { waitThenRun } from '../../util/BrowserWrapper';
import { fromEvent } from 'rxjs';
import EventBus, { Events } from '../../event';

export default class BaseScreen extends React.Component {
  static defaultProps = {
    children: null,
  };

  static propTypes = {
    setting: SettingType.isRequired,
    current: CurrentType.isRequired,
    contents: PropTypes.arrayOf(ContentType).isRequired,
    actionUpdateContent: PropTypes.func.isRequired,
    actionUpdateContentError: PropTypes.func.isRequired,
    calculationsTotal: PropTypes.number.isRequired,
    contentFormat: PropTypes.oneOf(ContentFormat.toList()).isRequired,
    isReadyToRead: PropTypes.bool.isRequired,
    children: PropTypes.node,
    selectable: PropTypes.bool.isRequired,
    annotationable: PropTypes.bool.isRequired,
    annotations: PropTypes.array,
    selection: PropTypes.object,
    isContentsLoaded: PropTypes.bool.isRequired,
  };

  static getDerivedStateFromProps(props) {
    // todo temporary code: Force to set annotation recalculation time
    return BaseScreen.recalculateAnnotations(props.annotations, props.setting.viewType, props.contents);
  }

  static needAnnotationRender(viewType, contents, annotation) {
    return !!contents.find(({ index, isInScreen }) => annotation.contentIndex === index && isInScreen);
  }

  static recalculateAnnotations(annotations, viewType, contents) {
    // todo temporary code: Force to set annotation recalculation time
    return {
      annotations: annotations.filter(BaseScreen.needAnnotationRender.bind(BaseScreen, viewType, contents))
        .map(item => ({
          ...item,
          ...Connector.calculations.getAnnotationCalculation(item),
        })),
    };
  }

  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      annotations: [],
    };
  }

  componentDidMount() {
    this.resizeEventSubscription = fromEvent(window, DOMEventConstants.RESIZE)
      .subscribe(event => EventBus.emit(Events.core.RESIZE, event));
  }

  componentWillUnmount() {
    if (this.resizeEventSubscription) {
      this.resizeEventSubscription.unsubscribe();
    }
  }

  moveToOffset() {
    const { annotations } = this.props;
    // todo temporary code: Force to set annotation recalculation time
    waitThenRun(() => {
      this.setState(BaseScreen.recalculateAnnotations(annotations));
    }, 0);
  }

  renderContents() { return null; }

  renderFooter() { return null; }

  render() {
    const {
      setting,
      calculationsTotal,
      contentFormat,
      isReadyToRead,
      isContentsLoaded,
      children,
      annotationable,
      selectable,
      selection,
    } = this.props;

    return (
      <TouchableScreen
        ref={this.wrapper}
        total={calculationsTotal}
        viewType={setting.viewType}
        StyledTouchable={getStyledTouchable(contentFormat, setting.viewType)}
        isReadyToRead={isReadyToRead}
        annotationable={annotationable}
        selectable={selectable}
        annotations={this.state.annotations}
        selection={selection}
      >
        { isContentsLoaded && this.renderContents() }
        { isContentsLoaded && this.renderFooter() }
        { isContentsLoaded && children }
      </TouchableScreen>
    );
  }
}

export const mapStateToProps = state => ({
  setting: selectReaderSetting(state),
  current: selectReaderCurrent(state),
  contents: selectReaderContents(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  contentFormat: selectReaderContentFormat(state),
  isReadyToRead: selectReaderIsReadyToRead(state),
  selection: selectReaderSelection(state),
  isContentsLoaded: selectReaderIsContentsLoaded(state),
});

export const mapDispatchToProps = dispatch => ({
  actionUpdateContent: (index, content, isAllLoaded) => dispatch(updateContent(index, content, isAllLoaded)),
  actionUpdateContentError: (index, error, isAllLoaded) => dispatch(updateContentError(index, error, isAllLoaded)),
});

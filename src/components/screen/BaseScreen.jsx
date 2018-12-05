/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { fromEvent } from 'rxjs';
import {
  selectReaderContents,
  selectReaderCurrent,
  selectReaderSetting,
  selectReaderCalculationsTotal,
  selectReaderContentFormat,
  selectReaderIsReadyToRead,
  selectReaderSelection,
  selectReaderIsContentsLoaded,
} from '../../redux/selector';
import PropTypes, { ContentType, CurrentType, SettingType } from '../prop-types';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { updateContent, updateContentError } from '../../redux/action';
import Connector from '../../service/connector';
import TouchableScreen from './TouchableScreen';
import { getStyledTouchable } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';
import { waitThenRun } from '../../util/BrowserWrapper';
import EventBus, { Events } from '../../event';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import { ViewType } from '../../constants/SettingConstants';

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

  _contentRefs = new Map();

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

  getContentRef(index) {
    if (!this._contentRefs.has(index)) {
      this._contentRefs.set(index, React.createRef());
    }
    return this._contentRefs.get(index);
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
      current,
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
        isLastPage={setting.viewType === ViewType.PAGE && current.contentIndex === FOOTER_INDEX}
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

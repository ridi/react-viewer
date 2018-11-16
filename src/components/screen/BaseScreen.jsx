/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { debounce, isExist } from '../../util/Util';
import {
  selectReaderContents,
  selectReaderCurrent,
  selectReaderSetting,
  selectReaderCalculationsTotal, selectReaderContentFormat, selectReaderIsReadyToRead, selectReaderSelection,
} from '../../redux/selector';
import PropTypes, { ContentType, CurrentType, SettingType } from '../prop-types';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { updateContent, updateContentError } from '../../redux/action';
import Connector from '../../service/connector';
import TouchableScreen from './TouchableScreen';
import { addEventListener, removeEventListener } from '../../util/EventHandler';
import { getStyledTouchable } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';
import { screenHeight, waitThenRun } from '../../util/BrowserWrapper';
import { ViewType } from '../..';

export default class BaseScreen extends React.Component {
  static defaultProps = {
    onTouched: null,
    onSelectionChanged: null,
    onAnnotationTouched: null,
    children: null,
  };

  static propTypes = {
    disableCalculation: PropTypes.bool.isRequired,
    setting: SettingType.isRequired,
    current: CurrentType.isRequired,
    contents: PropTypes.arrayOf(ContentType).isRequired,
    actionUpdateContent: PropTypes.func.isRequired,
    actionUpdateContentError: PropTypes.func.isRequired,
    calculationsTotal: PropTypes.number.isRequired,
    contentFormat: PropTypes.oneOf(ContentFormat.toList()).isRequired,
    isReadyToRead: PropTypes.bool.isRequired,
    onTouched: PropTypes.func,
    onSelectionChanged: PropTypes.func,
    onAnnotationTouched: PropTypes.func,
    children: PropTypes.node,
    selectable: PropTypes.bool.isRequired,
    annotationable: PropTypes.bool.isRequired,
    annotations: PropTypes.array,
    selection: PropTypes.object,
  };

  static getDerivedStateFromProps(props) {
    // todo temporary code: Force to set annotation recalculation time
    return BaseScreen.recalculateAnnotations(props.annotations, props.setting.viewType);
  }

  static needAnnotationRender(viewType, annotation) {
    if (!Connector.calculations.isContentCalculated(annotation.contentIndex)) return false;
    // todo temporary code: Force to set annotation recalculation time
    if (viewType === ViewType.SCROLL) {
      const { offset } = Connector.current.getCurrent();
      const [top, height] = [offset, screenHeight()];
      const contentIndexesInScreen = Connector.calculations.getContentIndexesInOffsetRange(top - (height * 2), top + height + (height * 2));
      return contentIndexesInScreen.includes(annotation.contentIndex);
    }
    const { contentIndex } = Connector.current.getCurrent();
    return contentIndex === annotation.contentIndex;
  }

  static recalculateAnnotations(annotations, viewType) {
    // todo temporary code: Force to set annotation recalculation time
    return {
      annotations: annotations.filter(BaseScreen.needAnnotationRender.bind(this, viewType))
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
    this.onContentLoaded = this.onContentLoaded.bind(this);
    this.onContentError = this.onContentError.bind(this);
    this.onTouchableScreenTouched = this.onTouchableScreenTouched.bind(this);
    this.onContentMount = this.onContentMount.bind(this);
  }

  componentDidMount() {
    const { isReadyToRead, disableCalculation } = this.props;
    if (isReadyToRead && !disableCalculation) {
      Connector.current.restoreCurrentOffset();
    }
    this.resizeReader = debounce(() => {
      if (!disableCalculation) {
        Connector.calculations.invalidate();
      }
    }, DOMEventDelayConstants.RESIZE);
    addEventListener(window, DOMEventConstants.RESIZE, this.resizeReader);
  }

  componentDidUpdate(prevProps) {
    const { current: prevCurrent, isReadyToRead: prevIsReadyToRead } = prevProps;
    const { current, isReadyToRead } = this.props;

    const hasJustCalculatedCurrent = !prevIsReadyToRead && isReadyToRead;
    const isCurrentMoved = (prevCurrent.offset !== current.offset
      || prevCurrent.contentIndex !== current.contentIndex
      || prevCurrent.viewType !== current.viewType);
    const isNeededRestore = hasJustCalculatedCurrent;
    const isNeededMoveToOffset = hasJustCalculatedCurrent || isCurrentMoved;

    if (isNeededRestore) Connector.current.restoreCurrentOffset();
    if (isNeededMoveToOffset) this.moveToOffset();
  }

  componentWillUnmount() {
    removeEventListener(window, DOMEventConstants.RESIZE, this.resizeReader);
  }

  onTouchableScreenTouched(event) {
    const { onTouched, isReadyToRead } = this.props;
    if (!isReadyToRead) return;
    if (isExist(onTouched)) {
      onTouched(event);
    }
  }

  onContentLoaded(index, content) {
    const { contents, actionUpdateContent } = this.props;
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);
    actionUpdateContent(index, content, isAllLoaded);
  }

  onContentError(index, error) {
    const { contents, actionUpdateContentError } = this.props;
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);
    actionUpdateContentError(index, error, isAllLoaded);
  }

  onContentMount(index) {
    const { current } = this.props;
    if (index === current.contentIndex) {
      // Connector.current.setReaderJs();
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
      children,
      annotationable,
      selectable,
      selection,
      onSelectionChanged,
      onAnnotationTouched,
    } = this.props;

    return (
      <TouchableScreen
        ref={this.wrapper}
        total={calculationsTotal}
        onTouched={this.onTouchableScreenTouched}
        viewType={setting.viewType}
        StyledTouchable={getStyledTouchable(contentFormat, setting.viewType)}
        isReadyToRead={isReadyToRead}
        annotationable={annotationable}
        selectable={selectable}
        annotations={this.state.annotations}
        selection={selection}
        onSelectionChanged={onSelectionChanged}
        onAnnotationTouched={onAnnotationTouched}
      >
        { this.renderContents() }
        { this.renderFooter() }
        { children }
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
});

export const mapDispatchToProps = dispatch => ({
  actionUpdateContent: (index, content, isAllLoaded) => dispatch(updateContent(index, content, isAllLoaded)),
  actionUpdateContentError: (index, error, isAllLoaded) => dispatch(updateContentError(index, error, isAllLoaded)),
});

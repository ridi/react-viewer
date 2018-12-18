import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../service/connector';
import {
  preventScrollEvent,
  allowScrollEvent,
  addEventListener,
  removeEventListener,
} from '../../util/EventHandler';
import { ViewType, SELECTION_BASE_CONTENT } from '../../constants/SettingConstants';
import SelectionLayer from '../selection/SelectionLayer';
import TouchEventHandler from '../../util/event/TouchEventHandler';
import { SelectionMode, SelectionParts } from '../..';
import { screenHeight, scrollBy } from '../../util/BrowserWrapper';
import EventBus, { Events } from '../../event';
import AnnotationStore from '../../store/AnnotationStore';

class TouchableScreen extends React.Component {
  static defaultProps = {
    forwardedRef: React.createRef(),
    children: null,
    total: null,
    StyledTouchable: () => {},
  };

  static propTypes = {
    children: PropTypes.node,
    forwardedRef: PropTypes.object,
    total: PropTypes.number,
    viewType: PropTypes.string.isRequired,
    StyledTouchable: PropTypes.func,
    isReadyToRead: PropTypes.bool.isRequired,
    annotations: PropTypes.array,
    selection: PropTypes.object,
    annotationable: PropTypes.bool.isRequired,
    selectable: PropTypes.bool.isRequired,
    isLastPage: PropTypes.bool.isRequired,
  };

  selectionRef = React.createRef();

  constructor(props) {
    super(props);
    this.handleTouchEvent = this.handleTouchEvent.bind(this);
  }

  componentDidMount() {
    const { current: node } = this.props.forwardedRef;
    if (this.isSelectable()) {
      addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
      addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
      addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
    }
    addEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
    this.touchHandler = new TouchEventHandler(node);
    this.touchHandler.attach();
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    const { current: node } = this.isSelectable() ? this.selectionRef : this.props.forwardedRef;
    this.touchHandler.detach();
    if (this.isSelectable()) {
      removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
      removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
      removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
    }
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
    this.handleScrollEvent(true);
  }

  isSelectable() {
    const { annotationable, selectable } = this.props;
    return annotationable || selectable;
  }

  handleTouchMoveInEdge(event) {
    const halfHeight = screenHeight() / 2;
    const normalizedY = halfHeight - Math.abs(halfHeight - event.detail.clientY);
    if (normalizedY < SelectionLayer.SCROLLING_EDGE) {
      scrollBy({
        top: SelectionLayer.SCROLLING_AMOUNT * (event.detail.clientY > halfHeight ? 1 : -1),
        behavior: 'smooth',
      });
    }
  }

  handleTouchEvent(event) {
    if (!Connector.calculations.isReadyToRead()) return;

    const { selectable, annotations, viewType } = this.props;
    const {
      clientX: x,
      clientY: y,
      target,
      pageY,
    } = event.detail;

    const selectionPart = target.dataset.type;
    const selectionId = target.dataset.id;
    if (event.type === TouchEventHandler.EVENT_TYPE.Touch) {
      Connector.selection.end();
      if (selectionPart === SelectionParts.TEXT && selectionId) {
        const annotation = annotations.find(({ id }) => `${id}` === `${selectionId}`);
        if (annotation) {
          const calculationInfo = AnnotationStore.getCalculation(selectionId);
          EventBus.emit(Events.TOUCH_ANNOTATION, { ...annotation, ...calculationInfo });
        } else {
          EventBus.emit(Events.TOUCH, event);
        }
      } else {
        EventBus.emit(Events.TOUCH, event);
      }
    } else if (selectable) {
      if (event.type === TouchEventHandler.EVENT_TYPE.TouchStart) {
        this.currentTouchStartPart = selectionPart;
        if (Connector.selection.selectionMode !== SelectionMode.USER_SELECTION) {
          let current = Connector.current.getCurrent();
          if (viewType === ViewType.SCROLL) {
            current = Connector.calculations.getContentIndexAndPositionAtOffset(pageY);
          }
          Connector.selection.start(x, y, current.contentIndex, current.position);
        }
      } else if (event.type === TouchEventHandler.EVENT_TYPE.TouchMove) {
        if (this.currentTouchStartPart === SelectionParts.UPPER_HANDLE) {
          Connector.selection.expandIntoUpper(x, y, SelectionMode.USER_SELECTION);
        } else if (this.currentTouchStartPart === SelectionParts.LOWER_HANDLE) {
          Connector.selection.expandIntoLower(x, y, SelectionMode.USER_SELECTION);
        } else {
          Connector.selection.expandIntoLower(x, y);
        }
        this.handleTouchMoveInEdge(event);
      } else if (event.type === TouchEventHandler.EVENT_TYPE.TouchEnd) {
        if (this.currentTouchStartPart === SelectionParts.UPPER_HANDLE) {
          Connector.selection.expandIntoUpper(x, y, SelectionMode.USER_SELECTION);
        } else if (this.currentTouchStartPart === SelectionParts.LOWER_HANDLE) {
          Connector.selection.expandIntoLower(x, y, SelectionMode.USER_SELECTION);
        } else {
          Connector.selection.expandIntoLower(x, y);
        }
        if (Connector.selection.isSelecting) {
          EventBus.emit(Events.CHANGE_SELECTION, {
            selection: Connector.selection.selection,
            selectionMode: Connector.selection.selectionMode,
          });
        }
        this.currentTouchStartPart = null;
      }
    }
  }

  handleScrollEvent(forceAllow = false) {
    // TODO isReadyToRead 체크를 제거할 수 있을까?
    const { viewType, forwardedRef, isReadyToRead } = this.props;
    if (forceAllow) {
      allowScrollEvent(forwardedRef.current);
      return;
    }

    if (viewType === ViewType.PAGE) {
      if (Connector.current.isOnFooter() || !Connector.selection.isSelecting) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
    if (viewType === ViewType.SCROLL) {
      if (isReadyToRead && !Connector.selection.isSelecting) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
  }

  renderSelectionLayer() {
    const {
      annotationable,
      selectable,
      annotations,
      selection,
      viewType,
      isLastPage,
    } = this.props;
    if ((!annotationable && !selectable) || isLastPage) return null;
    return (
      <SelectionLayer
        ref={this.selectionRef}
        annotationable={annotationable}
        selectable={selectable}
        viewType={viewType}
        annotations={annotations}
        selection={selection}
      />
    );
  }

  render() {
    const {
      forwardedRef,
      total,
      children,
      StyledTouchable,
    } = this.props;

    return (
      <StyledTouchable
        role="button"
        tabIndex="-1"
        innerRef={forwardedRef}
        id={SELECTION_BASE_CONTENT}
        total={total}
      >
        {this.renderSelectionLayer()}
        {children}
      </StyledTouchable>
    );
  }
}

export default React.forwardRef((props, ref) => <TouchableScreen forwardedRef={ref} {...props} />);

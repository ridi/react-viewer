import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../service/connector';
import {
  preventScrollEvent,
  allowScrollEvent,
  addEventListener,
  removeEventListener,
} from '../../util/EventHandler';
import TouchEventHandler from '../../util/event/ReaderGestureEventHandler';
import { ViewType } from '../../constants/SettingConstants';
import SelectionHelper from '../../service/readerjs/SelectionHelper';
import { screenHeight, scrollBy } from '../../util/BrowserWrapper';

class TouchableScreen extends React.Component {
  static SCROLLING_EDGE = 60;

  static SCROLLING_AMOUNT = 120;

  constructor(props) {
    super(props);
    this.touchHandler = null;
    this.handleTouchEvent = this.handleTouchEvent.bind(this);
  }

  componentDidMount() {
    const { current: node } = this.props.forwardedRef;
    addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
    addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
    addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
    addEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
    this.touchHandler = new TouchEventHandler(node);
    this.touchHandler.attach();
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    const { current: node } = this.props.forwardedRef;
    this.touchHandler.detach();
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
  }

  handleTouchEvent(event) {
    const {
      onTouched,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    } = this.props;
    switch (event.type) {
      case TouchEventHandler.EVENT_TYPE.Touch:
        onTouched(event);
        break;
      case TouchEventHandler.EVENT_TYPE.TouchStart:
        onTouchStart(event);
        this.handleScrollEvent();
        break;
      case TouchEventHandler.EVENT_TYPE.TouchMove:
        onTouchMove(event);
        this.handleTouchMoveInEdge(event);
        break;
      case TouchEventHandler.EVENT_TYPE.TouchEnd:
        onTouchEnd(event);
        this.handleScrollEvent();
        break;
      default: break;
    }
  }

  handleScrollEvent() {
    const { viewType, forwardedRef, isReadyToRead } = this.props;
    if (viewType === ViewType.PAGE) {
      if (Connector.current.isOnFooter() || !SelectionHelper.isInSelectionMode()) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
    if (viewType === ViewType.SCROLL) {
      if (isReadyToRead || !SelectionHelper.isInSelectionMode()) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
  }

  handleTouchMoveInEdge(event) {
    const halfHeight = screenHeight() / 2;
    const normalizedY = halfHeight - Math.abs(halfHeight - event.detail.clientY);
    if (normalizedY < TouchableScreen.SCROLLING_EDGE) {
      scrollBy({
        top: TouchableScreen.SCROLLING_AMOUNT * (event.detail.clientY > halfHeight ? 1 : -1),
        behavior: 'smooth',
      });
    }
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
        id="reader_contents"
        total={total}
      >
        {children}
      </StyledTouchable>
    );
  }
}

TouchableScreen.defaultProps = {
  forwardedRef: React.createRef(),
  onTouched: () => {},
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  children: null,
  total: null,
  StyledTouchable: () => {},
};

TouchableScreen.propTypes = {
  onTouched: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  children: PropTypes.node,
  forwardedRef: PropTypes.object,
  total: PropTypes.number,
  viewType: PropTypes.string.isRequired,
  StyledTouchable: PropTypes.func,
  isReadyToRead: PropTypes.bool.isRequired,
};

export default React.forwardRef((props, ref) => <TouchableScreen {...props} forwardedRef={ref} />);

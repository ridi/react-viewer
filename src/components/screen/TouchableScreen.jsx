import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../util/connector';
import {
  preventScrollEvent,
  allowScrollEvent,
  addEventListener,
  removeEventListener,
} from '../../util/EventHandler';
import ReaderGestureEventHandler from '../../util/event/ReaderGestureEventHandler';
import { ViewType } from '../../constants/SettingConstants';

class TouchableScreen extends React.Component {
  constructor(props) {
    super(props);
    this.gestureHandler = null;
    this.handleGestureEvent = this.handleGestureEvent.bind(this);
  }

  componentDidMount() {
    const { forwardedRef } = this.props;
    addEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.SelectionStart, this.handleGestureEvent);
    addEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.SelectionExpand, this.handleGestureEvent);
    addEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.SelectionEnd, this.handleGestureEvent);
    addEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.Touch, this.handleGestureEvent);
    this.gestureHandler = new ReaderGestureEventHandler(forwardedRef.current);
    this.gestureHandler.attach();
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    const { forwardedRef } = this.props;
    this.gestureHandler.detach();
    removeEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.SelectionStart, this.handleGestureEvent);
    removeEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.SelectionExpand, this.handleGestureEvent);
    removeEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.SelectionEnd, this.handleGestureEvent);
    removeEventListener(forwardedRef.current, ReaderGestureEventHandler.EVENT_TYPE.Touch, this.handleGestureEvent);
  }

  handleGestureEvent(event) {
    console.log(event.type, event);
  }

  handleScrollEvent() {
    const { viewType, forwardedRef, isReadyToRead } = this.props;
    if (viewType === ViewType.PAGE) {
      if (Connector.current.isOnFooter()) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
    if (viewType === ViewType.SCROLL) {
      if (isReadyToRead) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
  }

  render() {
    const {
      forwardedRef,
      total,
      children,
      onTouched,
      StyledTouchable,
    } = this.props;

    return (
      <StyledTouchable
        role="button"
        tabIndex="-1"
        innerRef={forwardedRef}
        id="reader_contents"
        total={total}
        onClick={onTouched}
      >
        {children}
      </StyledTouchable>
    );
  }
}

TouchableScreen.defaultProps = {
  forwardedRef: React.createRef(),
  onTouched: () => {},
  children: null,
  total: null,
  StyledTouchable: () => {},
};

TouchableScreen.propTypes = {
  onTouched: PropTypes.func,
  children: PropTypes.node,
  forwardedRef: PropTypes.object,
  total: PropTypes.number,
  viewType: PropTypes.string.isRequired,
  StyledTouchable: PropTypes.func,
  isReadyToRead: PropTypes.bool.isRequired,
};

export default React.forwardRef((props, ref) => <TouchableScreen {...props} forwardedRef={ref} />);

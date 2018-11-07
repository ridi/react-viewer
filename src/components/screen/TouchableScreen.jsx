import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../service/connector';
import {
  preventScrollEvent,
  allowScrollEvent,
} from '../../util/EventHandler';
import { ViewType } from '../../constants/SettingConstants';

class TouchableScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    this.handleScrollEvent(true);
  }

  // handleTouchEvent(event) {
  //   const {
  //     onTouched,
  //     onTouchStart,
  //     onTouchMove,
  //     onTouchEnd,
  //   } = this.props;
  //   switch (event.type) {
  //     case TouchEventHandler.EVENT_TYPE.Touch:
  //       onTouched(event);
  //       break;
  //     case TouchEventHandler.EVENT_TYPE.TouchStart:
  //       onTouchStart(event);
  //       this.handleScrollEvent();
  //       break;
  //     case TouchEventHandler.EVENT_TYPE.TouchMove:
  //       onTouchMove(event);
  //       this.handleTouchMoveInEdge(event);
  //       break;
  //     case TouchEventHandler.EVENT_TYPE.TouchEnd:
  //       onTouchEnd(event);
  //       this.handleScrollEvent();
  //       break;
  //     default: break;
  //   }
  // }

  handleScrollEvent(forceAllow = false) {
    const { viewType, forwardedRef, isReadyToRead } = this.props;
    if (forceAllow) {
      allowScrollEvent(forwardedRef.current);
      return;
    }

    if (viewType === ViewType.PAGE) {
      if (Connector.current.isOnFooter() || !Connector.selection.isSelectMode()) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
    if (viewType === ViewType.SCROLL) {
      if (isReadyToRead && !Connector.selection.isSelectMode()) allowScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
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

export default React.forwardRef((props, ref) => <TouchableScreen forwardedRef={ref} {...props} />);

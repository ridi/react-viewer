import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../service/connector';
import {
  preventScrollEvent,
  allowScrollEvent,
} from '../../util/EventHandler';
import { ViewType } from '../../constants/SettingConstants';
import { isExist } from '../../util/Util';

class TouchableScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleTouchEvent = this.handleTouchEvent.bind(this);
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

  handleTouchEvent(event) {
    // todo need to find more clear way to check ignore case
    if (event.target.getAttribute('data-type')) return;
    const { onTouched } = this.props;
    if (isExist(onTouched)) {
      onTouched(event);
    }
  }

  handleScrollEvent(forceAllow = false) {
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
        onClick={this.handleTouchEvent}
      >
        {children}
      </StyledTouchable>
    );
  }
}

TouchableScreen.defaultProps = {
  forwardedRef: React.createRef(),
  onTouched: null,
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

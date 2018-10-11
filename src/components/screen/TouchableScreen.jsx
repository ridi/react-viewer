import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../service/connector';
import { preventScrollEvent, allowScrollEvent } from '../../util/BrowserWrapper';
import { ViewType } from '../../constants/SettingConstants';

class TouchableScreen extends React.Component {
  componentDidMount() {
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
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

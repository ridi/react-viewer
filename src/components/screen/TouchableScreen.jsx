import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../util/connector/';
import { preventScrollEvent, removeScrollEvent } from '../../util/CommonUi';
import { ViewType } from '../../constants/SettingConstants';

class TouchableScreen extends React.Component {
  componentDidMount() {
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
  }

  handleScrollEvent() {
    const { viewType, forwardedRef } = this.props;
    if (viewType === ViewType.PAGE) {
      if (Connector.current.isOnFooter()) removeScrollEvent(forwardedRef.current);
      else preventScrollEvent(forwardedRef.current);
    }
  }

  render() {
    const {
      forwardedRef,
      total,
      children,
      onTouched,
    } = this.props;

    const StyledTouchable = Connector.setting.getStyledTouchable();
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
};

TouchableScreen.propTypes = {
  onTouched: PropTypes.func,
  children: PropTypes.node,
  forwardedRef: PropTypes.object,
  total: PropTypes.number,
  viewType: PropTypes.string.isRequired,
};

export default React.forwardRef((props, ref) => <TouchableScreen {...props} forwardedRef={ref} />);

import React from 'react';
import PropTypes from '../prop-types';
import Connector from '../../util/connector/';

export const Position = {
  LEFT: 1,
  MIDDLE: 2,
  RIGHT: 3,
};

export default class BaseTouchable extends React.Component {
  onTouchScreenHandle(event, position) {
    event.preventDefault();
    event.stopPropagation();

    if (Connector.calculations.isOnFooter()) {
      return;
    }

    const { onTouched } = this.props;
    onTouched({ position });
  }

  renderContent() {
    const { children } = this.props;
    return children;
  }

  render() {
    const { forwardedRef } = this.props;
    const StyledTouchable = Connector.setting.getStyledTouchable();
    return (
      <StyledTouchable
        role="button"
        tabIndex="-1"
        innerRef={forwardedRef}
        id="reader_contents"
        onClick={e => this.onTouchScreenHandle(e, Position.MIDDLE)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            this.onTouchScreenHandle(e, Position.MIDDLE);
          } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            this.onTouchScreenHandle(e, Position.LEFT);
          } else if (e.key === 'ArrowRight' || e.key === 'Right') {
            this.onTouchScreenHandle(e, Position.RIGHT);
          }
        }}
      >
        {this.renderContent()}
      </StyledTouchable>
    );
  }
}

BaseTouchable.defaultProps = {
  forwardedRef: React.createRef(),
  onTouched: () => {},
  children: null,
};

BaseTouchable.propTypes = {
  onTouched: PropTypes.func,
  children: PropTypes.node,
  forwardedRef: PropTypes.object,
};

import React, { Component, PropTypes } from 'react';
import { ScrollScreen, SizingWrapper } from '../../styled/viewerScreen/ViewerScreen.styled';


export default class ScrollTouchable extends Component {
  render() {
    const { children, onTouched, contentType, footer } = this.props;

    return (
      <ScrollScreen
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onTouched();
        }}
      >
        <SizingWrapper
          contentType={contentType}
        >
          {children}
        </SizingWrapper>
        {footer}
      </ScrollScreen>
    );
  }
}

ScrollTouchable.propTypes = {
  children: PropTypes.node,
  onTouched: PropTypes.func,
  contentType: PropTypes.number,
  footer: PropTypes.node,
};
ScrollTouchable.defaultProps = {
  footer: null
};

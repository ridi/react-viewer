import React from 'react';
import PropTypes from 'prop-types';
import { ScrollScreen, SizingWrapper } from '../../styled/viewerScreen/ViewerScreen.styled';


const ScrollTouchable = (props) => {
  const {
    children, onTouched, contentType, footer,
  } = props;

  return (
    <ScrollScreen
      onClick={(e) => {
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
};

ScrollTouchable.propTypes = {
  children: PropTypes.node,
  onTouched: PropTypes.func,
  contentType: PropTypes.number,
  footer: PropTypes.node,
};
ScrollTouchable.defaultProps = {
  footer: null,
};

export default ScrollTouchable;

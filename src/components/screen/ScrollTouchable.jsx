import React from 'react';
import BaseTouchable from './BaseTouchable';

class ScrollTouchable extends BaseTouchable {}

ScrollTouchable.defaultProps = {
  ...BaseTouchable.defaultProps,
};

ScrollTouchable.propTypes = {
  ...BaseTouchable.propTypes,
};

export default React.forwardRef((props, ref) => <ScrollTouchable {...props} forwardedRef={ref} />);

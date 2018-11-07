import React from 'react';
import PropTypes from 'prop-types';

const SelectionHandle = ({
  x,
  y,
  cursorHeight,
  color,
  cursorWidth,
  isUpper,
}) => (
  <>
    <circle
      cx={x}
      cy={isUpper ? y : y + cursorHeight}
      r={cursorHeight / 3}
      fill={color}
    />
    <rect
      x={x - (cursorWidth / 2)}
      y={y}
      width={cursorWidth}
      height={cursorHeight}
      fill={color}
    />
  </>
);

SelectionHandle.defaultProps = {
  cursorWidth: 2,
  isUpper: false,
};

SelectionHandle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  cursorHeight: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  cursorWidth: PropTypes.number,
  isUpper: PropTypes.bool,
};

export default SelectionHandle;

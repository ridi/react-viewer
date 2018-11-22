import React from 'react';
import PropTypes from 'prop-types';
import { SelectionParts } from '../../constants/SelectionConstants';

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
      data-type={isUpper ? SelectionParts.UPPER_HANDLE : SelectionParts.LOWER_HANDLE}
      cx={x}
      cy={isUpper ? y : y + cursorHeight}
      r={cursorHeight / 3}
      fill={color}
    />
    <rect
      data-type={isUpper ? SelectionParts.UPPER_HANDLE : SelectionParts.LOWER_HANDLE}
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

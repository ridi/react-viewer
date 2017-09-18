import React from 'react';
import PropTypes from 'prop-types';


const SvgIcons = ({ svgClass, svgColor, svgName }) => (
  <svg
    className={`svg_component ${svgClass}`}
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    fill={svgColor}
  >
    <use xlinkHref={`#${svgName}`} />
  </svg>
);

SvgIcons.propTypes = {
  svgClass: PropTypes.string,
  svgColor: PropTypes.string,
  svgName: PropTypes.string.isRequired,
};

SvgIcons.defulatProps = {
  svgClass: ''
};

export default SvgIcons;

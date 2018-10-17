import React from 'react';
import PropTypes from 'prop-types';

const Selection = ({ color, rects }) => (
  <svg
    id="selection"
    xmlns="http://www.w3.org/2000/svg"
    width={window.innerWidth}
    height={window.innerHeight}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -10,
    }}
  >
    <g fill={color} fillOpacity={0.3} style={{ mixBlendMode: 'multiply' }}>
      { rects.map(({
        top,
        left,
        width,
        height,
      }) => (<rect x={left} y={top} width={width} height={height} />))}
    </g>
  </svg>
);

Selection.propTypes = {
  color: PropTypes.string.isRequired,
  rects: PropTypes.array.isRequired,
};

export default Selection;

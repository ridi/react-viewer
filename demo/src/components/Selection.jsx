import React from 'react';
import PropTypes from 'prop-types';

export const SelectionMode = {
  NONE: 'none', // 아무런 모드도 아님 (검색 키워드, 형광펜 및 메모만 표시하는 모드)
  SELECTION: 'selection', // 셀렉션 모드 (검색 키워드, 형광펜 및 메모도 같이 표시함)
  AUTO_HIGHLIGHT: 'auto_highlight', // 오토 하이라이트 모드 (검색 키워드, 형광펜 및 메모도 같이 표시함)
};

const SelectionHandle = ({
  x,
  y,
  radius,
  color,
}) => (
  <circle cx={x} cy={y} r={radius} fill={color} />
);

SelectionHandle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

const Selection = ({
  highlightColor,
  selectionColor,
  rects,
  position,
  selectionMode = SelectionMode.NONE,
}) => {
  if (selectionMode === SelectionMode.NONE) return null;
  const color = selectionMode === SelectionMode.SELECTION ? selectionColor : highlightColor;
  const firstRect = rects.length > 0 ? rects[0] : null;
  const lastRect = rects.length > 0 ? rects[rects.length - 1] : null;
  return (
    <svg
      id="selection"
      xmlns="http://www.w3.org/2000/svg"
      width={position.width}
      height={position.height}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: '-1',
      }}
    >
      <g>
        { selectionMode === SelectionMode.SELECTION && firstRect
          && (
            <SelectionHandle
              x={firstRect.left}
              y={firstRect.top}
              color={color}
              radius={firstRect.height / 2}
            />
          )}
        { rects.map(({
          top,
          left,
          width,
          height,
        }) => (
          <rect
            x={left}
            y={top}
            width={width}
            height={height}
            fill={color}
            fillOpacity={0.3}
            style={{
              mixBlendMode: 'multiply',
            }}
          />
        ))}
        { selectionMode === SelectionMode.SELECTION && firstRect
        && (
          <SelectionHandle
            x={lastRect.left + lastRect.width}
            y={lastRect.top + lastRect.height}
            color={color}
            radius={firstRect.height / 2}
          />
        )}
      </g>
    </svg>
  );
};

Selection.propTypes = {
  highlightColor: PropTypes.string.isRequired,
  selectionColor: PropTypes.string.isRequired,
  rects: PropTypes.array.isRequired,
  position: PropTypes.object.isRequired,
  selectionMode: PropTypes.string.isRequired,
};

export default Selection;

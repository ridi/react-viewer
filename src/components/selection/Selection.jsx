import React from 'react';
import PropTypes from 'prop-types';
import { SelectionStyleType, SelectionParts } from '../../constants/SelectionConstants';
import SelectionHandle from './SelectionHandle';

const getRectProps = (rect, selectionStyle) => {
  const defaultProps = {
    key: `SelectionRange-rect-${rect.top}:${rect.left}:${rect.width}:${rect.height}`,
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };

  if (selectionStyle.type === SelectionStyleType.HIGHLIGHT) {
    return {
      ...defaultProps,
      fill: selectionStyle.color,
      fillOpacity: 0.3,
    };
  }
  if (selectionStyle.type === SelectionStyleType.UNDERLINE) {
    return {
      ...defaultProps,
      fill: '#FFFFFF',  // 설정하지 않으면 빈 공간에 click 이벤트를 받을 수 없음
      fillOpacity: 0,
      stroke: selectionStyle.color,
      strokeWidth: 2,
      strokeDasharray: `0 ${rect.width + rect.height + 1}px ${rect.width - 1}  0`,
    };
  }
  return defaultProps;
};

const Selection = ({
  item,
}) => {
  const { rects, withHandle, style } = item;
  if (!rects || rects.length === 0) return null;

  const firstRect = rects.length > 0 ? rects[0] : null;
  const lastRect = rects.length > 0 ? rects[rects.length - 1] : null;

  return (
    <g>
      {withHandle
      && (
        <SelectionHandle
          x={firstRect.left}
          y={firstRect.top}
          color={style.color}
          cursorHeight={firstRect.height}
          isUpper
        />
      )
      }
      {rects.map(rect => (
        <rect
          data-id={item.id}
          data-type={SelectionParts.TEXT}
          style={{ mixBlendMode: 'multiply' }}
          {...getRectProps(rect, style)}
        />
      ))}
      {withHandle
      && (
        <SelectionHandle
          x={lastRect.left + lastRect.width}
          y={lastRect.top}
          color={style.color}
          cursorHeight={firstRect.height}
        />
      )
      }
    </g>
  );
};

Selection.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.any,
    rects: PropTypes.array,
    withHandle: PropTypes.bool,
    style: PropTypes.shape({
      color: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  }),
};

export default Selection;

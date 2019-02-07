import React from 'react';
import PropTypes from 'prop-types';
import { SelectionStyleType, SelectionParts } from '../../constants/SelectionConstants';
import SelectionHandle from './SelectionHandle';
import Service from '../../service';
import { screenWidth } from '../../util/BrowserWrapper';
import { hasIntersect } from '../../util/Util';
import SettingConnector from '../../service/connector/SettingConnector';

const getRectProps = (rect, { color, style }) => {
  const defaultProps = {
    key: `SelectionRange-rect-${rect.top}:${rect.left}:${rect.width}:${rect.height}`,
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };

  if (style === SelectionStyleType.HIGHLIGHT) {
    return {
      ...defaultProps,
      fill: color,
      fillOpacity: 0.3,
    };
  }
  if (style === SelectionStyleType.UNDERLINE) {
    return {
      ...defaultProps,
      fill: '#FFFFFF',  // 설정하지 않으면 빈 공간에 click 이벤트를 받을 수 없음
      fillOpacity: 0,
      stroke: color,
      strokeWidth: 2,
      strokeDasharray: `0 ${rect.width + rect.height + 1}px ${rect.width - 1}  0`,
    };
  }
  return defaultProps;
};

const isVisible = ({ left, width }) => {
  const w = screenWidth();
  const containerMargin = SettingConnector.getContainerHorizontalMargin();
  const leftMargin = [0, containerMargin];
  const rightMargin = [w - containerMargin, w];
  const rect = [left, left + width];
  return !hasIntersect(rect, leftMargin) && !hasIntersect(rect, rightMargin);
};

const Selection = ({
  item,
}) => {
  const {
    rects: originalRects,
    withHandle,
    color,
    type,
  } = item;
  if (!originalRects || originalRects.length === 0) return null;
  let rects = originalRects;
  if (type !== 'selection') {
    rects = Service.selection.toPageRelativeRects(originalRects);
  }
  const firstRect = rects.length > 0 ? rects[0] : null;
  const lastRect = rects.length > 0 ? rects[rects.length - 1] : null;

  return (
    <g>
      {withHandle
      && (
        <SelectionHandle
          x={firstRect.left}
          y={firstRect.top}
          color={color.color}
          cursorHeight={firstRect.height}
          isUpper
        />
      )
      }
      {rects.map(rect => (
        isVisible(rect) && <rect
          data-id={item.id}
          data-type={SelectionParts.TEXT}
          style={{ mixBlendMode: 'multiply' }}
          {...getRectProps(rect, color)}
        />
      ))}
      {withHandle
      && (
        <SelectionHandle
          x={lastRect.left + lastRect.width}
          y={lastRect.top}
          color={color.color}
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
    color: PropTypes.shape({
      color: PropTypes.string,
      style: PropTypes.string,
    }).isRequired,
  }),
};

export default Selection;

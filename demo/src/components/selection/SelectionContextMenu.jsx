import React from 'react';
import PropTypes from 'prop-types';
import { SelectionStyleType } from '@ridi/react-viewer';
import { RangedAnnotationStyles } from '../../constants/SelectionConstants';

const getButtonStyles = (color) => {
  const defaultProps = {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    overflow: 'hidden',
    margin: '0 4px',
  };

  if (color === null) {
    return {
      ...defaultProps,
      color: 'red',
      border: '2px solid red',
    };
  }
  if (color.type === SelectionStyleType.HIGHLIGHT) {
    return {
      ...defaultProps,
      backgroundColor: color.color,
      border: 0,
    };
  }
  if (color.type === SelectionStyleType.UNDERLINE) {
    return {
      ...defaultProps,
      backgroundColor: '#fff',
      border: `2px solid ${color.color}`,
    };
  }
  return defaultProps;
};

const SelectionContextMenu = ({
  top,
  left,
  targetItem,
  onClickItem,
}) => (
  <div
    style={{
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '100',
      padding: '6px',
      backgroundColor: '#222',
      borderRadius: '6px',
    }}
  >
    <section style={{ padding: '10px' }}>
      <h2
        style={{
          margin: '0 0 4px 0',
          fontSize: '10px',
          fontWeight: '800',
          color: '#616161',
        }}
      >
        COLORS
      </h2>
      { RangedAnnotationStyles.map(color => (
        <button
          type="button"
          key={`ContentMenu-${color.color}`}
          style={getButtonStyles(color)}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClickItem({ ...targetItem, color });
          }}
        >
          <span className="indent_hidden">{color.color}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onClickItem({ ...targetItem, color: null });
        }}
        style={getButtonStyles(null)}
      >
        X
        <span className="indent_hidden">삭제</span>
      </button>
    </section>
  </div>
);

SelectionContextMenu.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  onClickItem: PropTypes.func.isRequired,
  targetItem: PropTypes.object.isRequired,
};

export default SelectionContextMenu;

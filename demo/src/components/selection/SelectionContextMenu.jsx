import React from 'react';
import PropTypes from 'prop-types';
import { SelectionStyleType } from '@ridi/react-viewer';
import { RangedAnnotationStyles } from '../../constants/SelectionConstants';

const getButtonStyles = (style) => {
  const defaultProps = {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    overflow: 'hidden',
    margin: '0 4px',
  };

  if (style === null) {
    return {
      ...defaultProps,
      color: 'red',
      border: '2px solid red',
    };
  }
  if (style.type === SelectionStyleType.HIGHLIGHT) {
    return {
      ...defaultProps,
      backgroundColor: style.color,
      border: 0,
    };
  }
  if (style.type === SelectionStyleType.UNDERLINE) {
    return {
      ...defaultProps,
      backgroundColor: '#fff',
      border: `2px solid ${style.color}`,
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
      { RangedAnnotationStyles.map(style => (
        <button
          type="button"
          key={`ContentMenu-${style.color}`}
          style={getButtonStyles(style)}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClickItem({ ...targetItem, style });
          }}
        >
          <span className="indent_hidden">{style.color}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onClickItem({ ...targetItem, style: null });
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

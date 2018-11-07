import React from 'react';
import PropTypes from 'prop-types';
import Selection from './Selection';
import StyledSelectionLayer from '../styled/StyledSelectionLayer';

const SelectionLayer = ({
  items,
  onItemTouched,
  viewType,
  contentIndex,
}) => (
  <StyledSelectionLayer viewType={viewType} contentIndex={contentIndex}>
    {items.map(item => (
      <Selection key={item.id} item={item} onTouched={onItemTouched} />
    ))}
  </StyledSelectionLayer>
);

SelectionLayer.defaultProps = {
  items: [],
  onItemTouched: null,
};

SelectionLayer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    rects: PropTypes.array,
    withHandle: PropTypes.bool,
    style: PropTypes.shape({
      color: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  })),
  onItemTouched: PropTypes.func,
  viewType: PropTypes.string.isRequired,
  contentIndex: PropTypes.number.isRequired,
};

export default SelectionLayer;

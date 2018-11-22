import React from 'react';
import PropTypes from 'prop-types';
import StyledSelectionLayer from '../styled/StyledSelectionLayer';
import Selection from './Selection';

class SelectionLayer extends React.Component {
  static SCROLLING_EDGE = 60;

  static SCROLLING_AMOUNT = 120;

  static propTypes = {
    annotations: PropTypes.array,
    annotationable: PropTypes.bool.isRequired,
    selection: PropTypes.object,
    selectable: PropTypes.bool.isRequired,
    forwardedRef: PropTypes.any.isRequired,
  };

  getSelectionItems() {
    const {
      annotations,
      selection,
      annotationable,
      selectable,
    } = this.props;
    let items = [];
    if (annotationable && annotations) {
      items = [...annotations];
    }
    if (selectable && selection) {
      items.push(selection);
    }
    return items;
  }

  render() {
    const { forwardedRef } = this.props;
    const items = this.getSelectionItems();
    return (
      <StyledSelectionLayer innerRef={forwardedRef}>
        {items.map(item => (
          <Selection key={`selection-${item.id}`} item={item} />
        ))}
      </StyledSelectionLayer>
    );
  }
}

export default React.forwardRef((props, ref) => <SelectionLayer forwardedRef={ref} {...props} />);

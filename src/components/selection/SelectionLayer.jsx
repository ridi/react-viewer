import React from 'react';
import PropTypes from 'prop-types';
import StyledSelectionLayer from '../styled/StyledSelectionLayer';
import Selection from './Selection';
import withStore from '../WithStore';
import AnnotationStore from '../../store/AnnotationStore';
import SelectionStore from '../../store/SelectionStore';

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
    if (selectable && selection.selection) {
      // TODO 다듬기
      items.push({ type: 'selection', ...selection.selection });
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

const SelectionLayerWithStore = withStore({
  annotations: AnnotationStore,
  selection: SelectionStore,
})(SelectionLayer);

export default React.forwardRef((props, ref) => <SelectionLayerWithStore forwardedRef={ref} {...props} />);

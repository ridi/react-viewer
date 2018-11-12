import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Connector from '../../service/connector';
import SelectionLayer from './SelectionLayer';
import TouchEventHandler from '../../util/event/TouchEventHandler';
import { isExist } from '../../util/Util';
import { screenHeight, scrollBy } from '../../util/BrowserWrapper';
import { selectReaderSelection, selectReaderSelectionMode } from '../../redux/selector';
import { SelectionMode, SelectionParts } from '../../constants/SelectionConstants';

class WithSelection extends React.Component {
  static SCROLLING_EDGE = 60;

  static SCROLLING_AMOUNT = 120;

  static propTypes = {
    contentIndex: PropTypes.number.isRequired,
    viewType: PropTypes.string.isRequired,
    annotations: PropTypes.array,
    annotationable: PropTypes.bool.isRequired,
    onSelectionChanged: PropTypes.func,
    onAnnotationTouched: PropTypes.func,
    selection: PropTypes.object,
    selectionMode: PropTypes.string.isRequired,
    selectable: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleTouchEvent = this.handleTouchEvent.bind(this);

    this.currentTouchStartPart = null;
  }

  getSelectionItems() {
    const {
      contentIndex,
      annotations,
      selection,
      annotationable,
      selectable,
    } = this.props;
    let items = [];
    if (annotationable && annotations) {
      items = [...annotations].filter(item => item.contentIndex === contentIndex)
        .map(item => ({
          ...item,
          ...Connector.calculations.getAnnotationCalculation(item),
        }));
    }
    if (selectable && selection) {
      items.push(selection);
    }
    return items;
  }

  handleTouchMoveInEdge(event) {
    // todo upper edge
    const halfHeight = screenHeight() / 2;
    const normalizedY = halfHeight - Math.abs(halfHeight - event.detail.clientY);
    if (normalizedY < WithSelection.SCROLLING_EDGE) {
      scrollBy({
        top: WithSelection.SCROLLING_AMOUNT * (event.detail.clientY > halfHeight ? 1 : -1),
        behavior: 'smooth',
      });
    }
  }

  handleTouchEvent(event) {
    const {
      selectable,
      onSelectionChanged,
      selection,
      selectionMode,
      onAnnotationTouched,
      annotations,
    } = this.props;
    const { clientX: x, clientY: y, target } = event.detail;
    const selectionPart = target.getAttribute('data-type');
    const selectionId = target.getAttribute('data-id');
    switch (event.type) {
      case TouchEventHandler.EVENT_TYPE.Touch:
        Connector.selection.endSelection();
        if (isExist(onAnnotationTouched)) {
          if (selectionPart === SelectionParts.TEXT && selectionId) {
            const annotation = annotations.find(({ id }) => `${id}` === `${selectionId}`);
            if (annotation) {
              event.stopPropagation();
              onAnnotationTouched({
                ...annotation,
                ...Connector.calculations.getAnnotationCalculation(annotation),
              });
            }
          }
        }
        break;
      case TouchEventHandler.EVENT_TYPE.TouchStart:
        if (!selectable) break;
        this.currentTouchStartPart = selectionPart;
        Connector.selection.startSelection(x, y);
        break;
      case TouchEventHandler.EVENT_TYPE.TouchMove:
        if (!selectable) break;
        if (this.currentTouchStartPart === SelectionParts.UPPER_HANDLE) {
          Connector.selection.expandUpper(x, y, SelectionMode.USER_SELECTION);
        } else if (this.currentTouchStartPart === SelectionParts.LOWER_HANDLE) {
          Connector.selection.expandLower(x, y, SelectionMode.USER_SELECTION);
        } else {
          Connector.selection.expandLower(x, y);
        }
        this.handleTouchMoveInEdge(event);
        break;
      case TouchEventHandler.EVENT_TYPE.TouchEnd:
        if (!selectable) break;

        if (this.currentTouchStartPart === SelectionParts.UPPER_HANDLE) {
          Connector.selection.expandUpper(x, y, SelectionMode.USER_SELECTION);
        } else if (this.currentTouchStartPart === SelectionParts.LOWER_HANDLE) {
          Connector.selection.expandLower(x, y, SelectionMode.USER_SELECTION);
        } else {
          Connector.selection.expandLower(x, y);
        }
        if (isExist(onSelectionChanged)) {
          onSelectionChanged({ selection, selectionMode });
        }
        this.currentTouchStartPart = null;
        break;
      default: break;
    }
  }

  render() {
    const {
      contentIndex,
      viewType,
    } = this.props;
    const { contentIndex: currentContentIndex } = Connector.current.getCurrent();
    if (currentContentIndex !== contentIndex || !Connector.selection.isAvailable()) return null;

    return (
      <SelectionLayer
        items={this.getSelectionItems()}
        viewType={viewType}
        contentIndex={contentIndex}
        onTouched={this.handleTouchEvent}
      />
    );
  }
}

const mapStateToProps = state => ({
  selection: selectReaderSelection(state),
  selectionMode: selectReaderSelectionMode(state),
});

export default connect(mapStateToProps)(WithSelection);

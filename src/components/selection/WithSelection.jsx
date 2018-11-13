import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Connector from '../../service/connector';
import SelectionLayer from './SelectionLayer';
import TouchEventHandler from '../../util/event/TouchEventHandler';
import { isExist } from '../../util/Util';
import { screenHeight, scrollBy } from '../../util/BrowserWrapper';
import { selectReaderSelection } from '../../redux/selector';
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
      onAnnotationTouched,
      annotations,
    } = this.props;
    const { clientX: x, clientY: y, target } = event.detail;

    const selectionPart = target.getAttribute('data-type');
    const selectionId = target.getAttribute('data-id');
    if (event.type === TouchEventHandler.EVENT_TYPE.Touch) {
      Connector.selection.end();

      if (isExist(onAnnotationTouched)) {
        if (selectionPart === SelectionParts.TEXT && selectionId) {
          const annotation = annotations.find(({ id }) => `${id}` === `${selectionId}`);
          if (annotation) {
            onAnnotationTouched({
              ...annotation,
              ...Connector.calculations.getAnnotationCalculation(annotation),
            });
          }
        }
      }
    } else if (selectable) {
      if (event.type === TouchEventHandler.EVENT_TYPE.TouchStart) {
        this.currentTouchStartPart = selectionPart;
        if (Connector.selection.selectionMode !== SelectionMode.USER_SELECTION) {
          Connector.selection.start(x, y);
        }
      } else if (event.type === TouchEventHandler.EVENT_TYPE.TouchMove) {
        if (this.currentTouchStartPart === SelectionParts.UPPER_HANDLE) {
          Connector.selection.expandIntoUpper(x, y, SelectionMode.USER_SELECTION);
        } else if (this.currentTouchStartPart === SelectionParts.LOWER_HANDLE) {
          Connector.selection.expandIntoLower(x, y, SelectionMode.USER_SELECTION);
        } else {
          Connector.selection.expandIntoLower(x, y);
        }
        this.handleTouchMoveInEdge(event);
      } else if (event.type === TouchEventHandler.EVENT_TYPE.TouchEnd) {
        if (this.currentTouchStartPart === SelectionParts.UPPER_HANDLE) {
          Connector.selection.expandIntoUpper(x, y, SelectionMode.USER_SELECTION);
        } else if (this.currentTouchStartPart === SelectionParts.LOWER_HANDLE) {
          Connector.selection.expandIntoLower(x, y, SelectionMode.USER_SELECTION);
        } else {
          Connector.selection.expandIntoLower(x, y);
        }
        if (isExist(onSelectionChanged)) {
          onSelectionChanged({
            selection: Connector.selection.selection,
            selectionMode: Connector.selection.selectionMode,
          });
        }
        this.currentTouchStartPart = null;
      }
    }
  }

  render() {
    const {
      contentIndex,
      viewType,
    } = this.props;
    const { contentIndex: currentContentIndex } = Connector.current.getCurrent();
    if (currentContentIndex !== contentIndex || !Connector.selection.isAvailable) return null;

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
});

export default connect(mapStateToProps)(WithSelection);

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Connector from '../../service/connector';
import SelectionLayer from './SelectionLayer';
import { addEventListener, removeEventListener } from '../../util/EventHandler';
import TouchEventHandler from '../../util/event/ReaderGestureEventHandler';
import { isExist } from '../../util/Util';
import { screenHeight, scrollBy } from '../../util/BrowserWrapper';
import { selectReaderSelection, selectReaderSelectionMode } from '../../redux/selector';

const withSelection = (Component) => {
  class WithSelection extends React.Component {
    static SCROLLING_EDGE = 60;

    static SCROLLING_AMOUNT = 120;

    static propTypes = {
      viewType: PropTypes.string.isRequired,
      localOffset: PropTypes.number.isRequired,
      annotations: PropTypes.array,
      annotationable: PropTypes.bool.isRequired,
      onTouched: PropTypes.func,
      onSelectionChanged: PropTypes.func,
      onAnnotationTouched: PropTypes.func,
      selection: PropTypes.object,
      selectionMode: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);

      this.handleTouchEvent = this.handleTouchEvent.bind(this);

      this.componentRef = React.createRef();
      this.touchHandler = null;
    }

    componentDidMount() {
      const node = this.componentRef.current;
      addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
      addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
      addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
      addEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
      this.touchHandler = new TouchEventHandler(node);
      this.touchHandler.attach();
    }

    componentWillUnmount() {
      const node = this.componentRef.current;
      this.touchHandler.detach();
      removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
      removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
      removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
      removeEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
    }

    handleTouchEvent(event) {
      const { onTouched, onSelectionChanged, selection, selectionMode } = this.props;
      switch (event.type) {
        case TouchEventHandler.EVENT_TYPE.Touch:
          Connector.selection.clearSelection();
          if (isExist(onTouched)) {
            onTouched(event);
          }
          break;
        case TouchEventHandler.EVENT_TYPE.TouchStart:
          Connector.selection.startSelection(event.detail.clientX, event.detail.clientY);
          break;
        case TouchEventHandler.EVENT_TYPE.TouchMove:
          Connector.selection.expandLower(event.detail.clientX, event.detail.clientY);
          this.handleTouchMoveInEdge(event);
          break;
        case TouchEventHandler.EVENT_TYPE.TouchEnd:
          if (Connector.selection.endSelection(event.detail.clientX, event.detail.clientY)) {
            if (isExist(onSelectionChanged)) {
              onSelectionChanged({
                selection,
                selectionMode,
              });
            }
          }
          break;
        default: break;
      }
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

    renderSelection() {
      const {
        content,
        annotations,
        onAnnotationTouched,
        selection,
        viewType,
      } = this.props;
      const { contentIndex } = Connector.current.getCurrent();
      if (contentIndex !== content.index || !Connector.selection.isAvailable()) return null;

      const items = [...annotations].filter(item => item.contentIndex === contentIndex)
        .map(item => ({
          ...item,
          ...Connector.calculations.getAnnotationCalculation(item),
        }));
      if (selection) {
        items.push(selection);
      }
      return (
        <SelectionLayer
          items={items}
          onItemTouched={onAnnotationTouched}
          viewType={viewType}
          contentIndex={content.index}
        />
      );
    }

    render() {
      return (
        <Component
          ref={this.componentRef}
          additionalContent={this.renderSelection()}
          {...this.props}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    selection: selectReaderSelection(state),
    selectionMode: selectReaderSelectionMode(state),
  });

  return connect(mapStateToProps)(WithSelection);
};

export default withSelection;

import React from 'react';
import PropTypes from 'prop-types';
import Selection from './Selection';
import StyledSelectionLayer from '../styled/StyledSelectionLayer';
import { addEventListener, removeEventListener } from '../../util/EventHandler';
import TouchEventHandler from '../../util/event/TouchEventHandler';

export default class SelectionLayer extends React.Component {
  static defaultProps = {
    items: [],
  };

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any,
      rects: PropTypes.array,
      withHandle: PropTypes.bool,
      style: PropTypes.shape({
        color: PropTypes.string,
        type: PropTypes.string,
      }).isRequired,
    })),
    viewType: PropTypes.string.isRequired,
    contentIndex: PropTypes.number.isRequired,
    onTouched: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.handleTouchEvent = this.handleTouchEvent.bind(this);
  }

  componentDidMount() {
    const node = this.ref.current;
    addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
    addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
    addEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
    addEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
    this.touchHandler = new TouchEventHandler(node);
    this.touchHandler.attach();
  }

  componentWillUnmount() {
    const node = this.ref.current;
    this.touchHandler.detach();
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchStart, this.handleTouchEvent);
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchMove, this.handleTouchEvent);
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.TouchEnd, this.handleTouchEvent);
    removeEventListener(node, TouchEventHandler.EVENT_TYPE.Touch, this.handleTouchEvent);
  }

  handleTouchEvent(e) {
    const { onTouched } = this.props;
    onTouched(e);
  }

  render() {
    const {
      items,
      viewType,
      contentIndex,
    } = this.props;

    return (
      <StyledSelectionLayer innerRef={this.ref} viewType={viewType} contentIndex={contentIndex}>
        {items.map(item => (
          <Selection key={`selection-${item.id}`} item={item} />
        ))}
      </StyledSelectionLayer>
    );
  }
}

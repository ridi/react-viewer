import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import {
  selectReaderCurrentOffset,
  Connector,
  selectReaderCalculationsTotal,
} from '@ridi/react-viewer';


class ViewerPageFooterToolbar extends Component {
  constructor(props) {
    super(props);
    const { currentOffset } = props;
    this.state = {
      value: typeof currentOffset === 'number' ? currentOffset + 1 : 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currentOffset } = nextProps;
    this.setState({ value: typeof currentOffset === 'number' ? currentOffset + 1 : 1 });
  }

  onSlideChanged(value) {
    this.setState({ value });
  }

  onSlideAfterChanged(offset) {
    Connector.current.updateCurrentOffset(offset);
  }

  render() {
    const { total } = this.props;
    const sliderProps = {
      min: 1,
      max: total,
      value: this.state.value,
    };
    return (
      <div className="viewer_footer_page_navigator">
        <p className="page_mark">
          <span className="current_page">{this.state.value}</span>
          <span className="slash">/</span>
          <span className="total_page">{total}</span>
        </p>
        <div className="page_slider_wrapper">
          <Slider
            {...sliderProps}
            onChange={value => this.onSlideChanged(value)}
            onAfterChange={value => this.onSlideAfterChanged(value - 1)}
          />
        </div>
      </div>
    );
  }
}

ViewerPageFooterToolbar.propTypes = {
  currentOffset: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isDisableComment: PropTypes.bool,
};

ViewerPageFooterToolbar.defaultProps = {
  isDisableComment: false,
};

const mapStateToProps = state => ({
  currentOffset: selectReaderCurrentOffset(state),
  total: selectReaderCalculationsTotal(state),
});


export default connect(mapStateToProps)(ViewerPageFooterToolbar);

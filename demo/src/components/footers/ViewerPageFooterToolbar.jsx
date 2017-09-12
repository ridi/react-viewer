import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import {
  movePageViewer as movePageViewerAction,
  selectPageViewPagination,
  showCommentArea as showCommentAreaAction
} from '../../../../lib/index';
import SvgIcons from '../icons/SvgIcons';


class ViewerPageFooterToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.pageViewPagination.currentPage,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { pageViewPagination } = nextProps;
    this.setState({ value: pageViewPagination.currentPage });
  }

  onSlideChanged(value) {
    this.setState({ value });
  }

  onSlideAfterChanged(value) {
    const { movePageViewer, pageViewPagination, showCommentArea } = this.props;
    movePageViewer(value);
    if (value === pageViewPagination.totalPage) {
      showCommentArea();
    }
  }

  render() {
    const { pageViewPagination } = this.props;
    const sliderProps = {
      min: 1,
      max: pageViewPagination.totalPage,
      value: this.state.value,
    };
    return (
      <div className="viewer_footer_page_navigator">
        <p className="page_mark">
          <span className="current_page">{this.state.value}</span>
          <SvgIcons
            svgName="svg_slash_1"
            svgClass="svg_slash_1"
          />
          <span className="indent_hidden">/</span>
          <span className="total_page">{pageViewPagination.totalPage}</span>
        </p>
        <div className="page_slider_wrapper">
          <Slider
            {...sliderProps}
            onChange={value => this.onSlideChanged(value)}
            onAfterChange={value => this.onSlideAfterChanged(value)}
          />
        </div>
      </div>
    );
  }
}

ViewerPageFooterToolbar.propTypes = {
  pageViewPagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPage: PropTypes.number,
    readProcess: PropTypes.number,
  }).isRequired,
  isDisableComment: PropTypes.bool,
  movePageViewer: PropTypes.func.isRequired,
  showCommentArea: PropTypes.func.isRequired,
};

ViewerPageFooterToolbar.defaultProps = {
  isDisableComment: false,
};

const mapStateToProps = (state, ownProps) => ({
  pageViewPagination: selectPageViewPagination(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  movePageViewer: number => {
    dispatch(movePageViewerAction(number));
  },
  showCommentArea: () => {
    const { isDisableComment = false } = ownProps;
    if (isDisableComment) {
      return;
    }
    dispatch(showCommentAreaAction());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerPageFooterToolbar);

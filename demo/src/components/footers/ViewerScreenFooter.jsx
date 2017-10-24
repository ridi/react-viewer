import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  movePageViewer as movePageViewerAction,
  selectPageViewPagination,
  selectViewerScreenSettings,
} from '../../../../lib/index';
import { AvailableViewerType } from '../../../../src/constants/ContentConstants';
import { ViewerType } from '../../../../src/constants/ViewerScreenConstants';
import { isExist } from '../../../../src/util/Util';
import SvgIcons from '../icons/SvgIcons';


class ViewerScreenFooter extends Component {
  onClickShowComments() {
    /* eslint-disable no-alert */
    alert('not available in demo page');
  }

  checkIsPageView() {
    const { content, viewerScreenSettings } = this.props;
    return ((content.viewer_type === AvailableViewerType.BOTH)
      && (viewerScreenSettings.viewerType === ViewerType.PAGE))
      || (content.viewer_type === AvailableViewerType.PAGE);
  }

  renderBestComments() {
    return (
      <div className="comment_empty">
        <p className="empty_text">댓글이 없습니다.</p>
      </div>
    );
  }

  render() {
    const {
      content,
      episode,
      // isNextEpisodeAvailable,
      // nextEpisodeUrl,
      movePageViewer,
      pageViewPagination,
    } = this.props;

    if (!isExist(content) || !isExist(episode)) {
      return null;
    }

    return (
      <div className="viewer_bottom">
        <div className="viewer_bottom_information">
          <p className="content_title">{content.title}</p>
          <p className="episode_title">{episode.title}</p>
        </div>
        <div
          role="presentation"
          className="viewer_bottom_best_comment empty"
          onClick={() => this.onClickShowComments()}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              this.onClickShowComments();
            }
          }}
        >
          {this.renderBestComments()}
          <button className="more_comment_button">
            전체 댓글 보러가기
            <SvgIcons
              svgName="svg_arrow_4_right"
              svgClass="arrow_icon"
            />
          </button>
        </div>
        <div className="viewer_bottom_button_wrapper">
          <div className="last_button_wrapper">
            <p className="last_episode_text">마지막 에피소드 입니다.</p>
          </div>
          {this.checkIsPageView() ? (
            <button
              className="move_prev_page_button"
              onClick={() => movePageViewer(pageViewPagination.totalPage - 1)}
            >
              <SvgIcons
                svgName="svg_arrow_6_left"
                svgClass="svg_arrow_6_left"
              />
              이전 페이지로 돌아가기
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

ViewerScreenFooter.propTypes = {
  content: PropTypes.object.isRequired,
  episode: PropTypes.object.isRequired,
  // isNextEpisodeAvailable: PropTypes.bool.isRequired,
  // nextEpisodeUrl: PropTypes.string.isRequired,
  viewerScreenSettings: PropTypes.object,
  movePageViewer: PropTypes.func.isRequired,
  pageViewPagination: PropTypes.object.isRequired,
};

ViewerScreenFooter.defaultProps = {
  viewerScreenSettings: {},
};

const mapStateToProps = (state, ownProps) => {
  const { content, episode } = ownProps;
  const isLoaded = content && episode;
  return {
    content,
    episode,
    viewerScreenSettings: selectViewerScreenSettings(state),
    isNextEpisodeAvailable: isLoaded && content.last_episode.volume > episode.volume,
    nextEpisodeUrl: '',
    pageViewPagination: selectPageViewPagination(state),
  };
};

const mapDispatchToProps = dispatch => ({
  movePageViewer: number => dispatch(movePageViewerAction(number)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerScreenFooter);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Connector,
  selectReaderSetting,
  selectReaderCalculationsTotal,
  ViewType,
} from '../../../../lib';
import { AvailableViewType } from '../../constants/ContentConstants';
import { isExist } from '../../../../src/util/Util';
import SvgIcons from '../icons/SvgIcons';


class ViewerScreenFooter extends Component {
  onClickShowComments() {
    /* eslint-disable no-alert */
    alert('not available in demo page');
  }

  checkIsPageView() {
    const { content, viewerScreenSettings } = this.props;
    return ((content.viewType === AvailableViewType.BOTH)
      && (viewerScreenSettings.viewType === ViewType.PAGE))
      || (content.viewType === AvailableViewType.PAGE);
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
      calculationsTotal,
    } = this.props;

    if (!isExist(content)) {
      return null;
    }

    return (
      <div className="viewer_bottom">
        <div className="viewer_bottom_information">
          <p className="content_title">{content.title}</p>
        </div>
        <div
          role="presentation"
          className="viewer_bottom_best_comment empty"
          onClick={() => this.onClickShowComments()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              this.onClickShowComments();
            }
          }}
        >
          {this.renderBestComments()}
          <button type="button" className="more_comment_button">
            전체 댓글 보러가기
            <SvgIcons
              svgName="svg_arrow_4_right"
              svgClass="arrow_icon"
            />
          </button>
        </div>
        <div className="viewer_bottom_button_wrapper">
          {this.checkIsPageView() ? (
            <button
              type="button"
              className="move_prev_page_button"
              onClick={() => Connector.current.updateCurrentPosition(calculationsTotal - 2)}
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
  viewerScreenSettings: PropTypes.object,
  calculationsTotal: PropTypes.number.isRequired,
};

ViewerScreenFooter.defaultProps = {
  viewerScreenSettings: {},
};

const mapStateToProps = state => ({
  viewerScreenSettings: selectReaderSetting(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
});

export default connect(mapStateToProps)(ViewerScreenFooter);

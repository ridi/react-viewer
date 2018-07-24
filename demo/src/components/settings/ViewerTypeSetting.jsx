import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSetting, AvailableViewerType, ViewerType } from '../../../../lib';
import SvgIcons from '../icons/SvgIcons';
import { preventScrollEvent } from '../../../../src/util/CommonUi';


class ViewerTypeSetting extends Component {
  renderViewerType() {
    const { viewerScreenSettings, contentViewerType, onChanged } = this.props;

    if (contentViewerType === AvailableViewerType.BOTH) {
      return ViewerType.toList().map(item => (
        <li className="view_type_list setting_button_list" key={item}>
          <button
            type="button"
            className={`view_type_button setting_button ${item} ${viewerScreenSettings.viewerType === item ? 'active' : ''}`}
            onClick={() => onChanged(item)}
          >
            {ViewerType.toString(item)}
          </button>
        </li>
      ));
    }

    return (
      <p className="setting_info_text">
        이 콘텐츠는 {contentViewerType === AvailableViewerType.PAGE ? '페이지 넘김' : '스크롤 보기'}만 지원됩니다.
      </p>
    );
  }

  render() {
    return (
      <li className="setting_list" ref={(list) => { preventScrollEvent(list); }}>
        <SvgIcons
          svgName="svg_view_type_1"
          svgClass="setting_title_icon svg_view_type_icon"
        />
        <div className="table_wrapper">
          <p className="setting_title">
            보기 방식<span className="indent_hidden">변경</span>
          </p>
          <div className="setting_buttons_wrapper view_type_setting">
            <ul className="setting_buttons view_type_buttons">
              {this.renderViewerType()}
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

ViewerTypeSetting.propTypes = {
  contentViewerType: PropTypes.number.isRequired,
  onChanged: PropTypes.func,
  viewerScreenSettings: PropTypes.object,
};

ViewerTypeSetting.defaultProps = {
  onChanged: () => {},
  viewerScreenSettings: {},
};

const mapStateToProps = state => ({
  viewerScreenSettings: selectSetting(state),
});

export default connect(mapStateToProps)(ViewerTypeSetting);

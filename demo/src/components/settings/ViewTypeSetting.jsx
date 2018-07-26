import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectReaderSetting, AvailableViewType, ViewType } from '../../../../lib';
import SvgIcons from '../icons/SvgIcons';
import { preventScrollEvent } from '../../../../src/util/CommonUi';


class ViewTypeSetting extends Component {
  renderViewType() {
    const { viewerScreenSettings, contentViewType, onChanged } = this.props;

    if (contentViewType === AvailableViewType.BOTH) {
      return ViewType.toList().map(item => (
        <li className="view_type_list setting_button_list" key={item}>
          <button
            type="button"
            className={`view_type_button setting_button ${item} ${viewerScreenSettings.viewType === item ? 'active' : ''}`}
            onClick={() => onChanged(item)}
          >
            {ViewType.toString(item)}
          </button>
        </li>
      ));
    }

    return (
      <p className="setting_info_text">
        이 콘텐츠는 {contentViewType === AvailableViewType.PAGE ? '페이지 넘김' : '스크롤 보기'}만 지원됩니다.
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
              {this.renderViewType()}
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

ViewTypeSetting.propTypes = {
  contentViewType: PropTypes.number.isRequired,
  onChanged: PropTypes.func,
  viewerScreenSettings: PropTypes.object,
};

ViewTypeSetting.defaultProps = {
  onChanged: () => {},
  viewerScreenSettings: {},
};

const mapStateToProps = state => ({
  viewerScreenSettings: selectReaderSetting(state),
});

export default connect(mapStateToProps)(ViewTypeSetting);

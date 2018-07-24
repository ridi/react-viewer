import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViewerThemeType } from '../../../../lib';
import SvgIcons from '../icons/SvgIcons';


export default class ThemeSetting extends Component {
  renderThemeList() {
    const { onChanged } = this.props;

    return ViewerThemeType.toList().map(item => (
      <li className="theme_list setting_button_list" key={item}>
        <button
          className={`theme_select_button setting_button ${item}_button`}
          type="button"
          onClick={() => {
            onChanged(item);
          }}
        >
          <SvgIcons
            svgName="svg_check_3"
            svgClass="theme_check_icon"
          />
          <span className="indent_hidden">white</span>
        </button>
      </li>
    ));
  }

  render() {
    return (
      <li className="setting_list theme_setting_list">
        <SvgIcons
          svgName="svg_beaker_2"
          svgClass="setting_title_icon svg_beaker_icon"
        />
        <p className="setting_title">
          <span className="indent_hidden">색상테마 선택</span>
        </p>
        <div className="theme_setting_wrapper">
          <div className="theme_scroll_area">
            <ul className="theme_setting">
              {this.renderThemeList()}
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

ThemeSetting.propTypes = {
  onChanged: PropTypes.func,
};

ThemeSetting.defaultProps = {
  onChanged: () => {},
};

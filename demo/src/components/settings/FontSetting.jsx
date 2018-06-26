import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSetting } from '../../../../lib';
import SvgIcons from '../icons/SvgIcons';


const Fonts = [
  { name: 'KoPup 돋움', family: 'kopup_dotum' },
  { name: 'KoPup 바탕', family: 'kopup_batang' },
];

class FontSetting extends Component {
  renderFontList() {
    const { onChanged, viewerScreenSettings } = this.props;

    return Fonts.map(item => (
      <li className="font_list setting_button_list" key={item.family}>
        <button
          type="button"
          // TODO ${item.family} style
          className={`font_button setting_button ${item.family} ${viewerScreenSettings.font === item.family ? 'active' : ''}`}
          onClick={() => onChanged && onChanged(item.family)}
        >{item.name}
        </button>
      </li>
    ));
  }

  render() {
    return (
      <li className="setting_list">
        <SvgIcons
          svgName="svg_font_2"
          svgClass="setting_title_icon svg_font_icon"
        />
        <div className="table_wrapper">
          <p className="setting_title">
            글꼴<span className="indent_hidden">변경</span>
          </p>
          <div className="setting_buttons_wrapper font_family_setting">
            <ul className="setting_buttons font_family_buttons">
              {this.renderFontList()}
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

FontSetting.propTypes = {
  onChanged: PropTypes.func,
  viewerScreenSettings: PropTypes.object,
};

FontSetting.defaultProps = {
  onChanged: () => {},
  viewerScreenSettings: {},
};

const mapStateToProps = state => ({
  viewerScreenSettings: selectSetting(state),
});

export default connect(mapStateToProps)(FontSetting);


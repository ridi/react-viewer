import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectViewerScreenSettings } from '../../../../lib/index';
import { ViewerFontType } from '../../../../src/constants/ViewerScreenConstants';
import SvgIcons from '../icons/SvgIcons';
import { preventScrollEvent } from '../../../../src/util/CommonUi';


class FontSetting extends Component {
  renderFontList() {
    const { onChanged, viewerScreenSettings } = this.props;

    return ViewerFontType.toList().map(item => (
      <li className="font_list setting_button_list" key={item}>
        <button
          type="button"
          className={`font_button setting_button ${item} ${viewerScreenSettings.font === item ? 'active' : ''}`}
          onClick={() => onChanged && onChanged(item)}
        >{ViewerFontType.toString(item)}
        </button>
      </li>
    ));
  }

  render() {
    return (
      <li className="setting_list" ref={list => { preventScrollEvent(list); }}>
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

const mapStateToProps = (state, ownProps) => ({
  viewerScreenSettings: selectViewerScreenSettings(state),
});

export default connect(
  mapStateToProps,
)(FontSetting);



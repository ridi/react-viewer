import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectReaderSetting } from '../../../../lib';
import SvgIcons from '../icons/SvgIcons';


class ColumnSetting extends Component {
  renderFontList() {
    const { onChanged, viewerScreenSettings } = this.props;

    return [1, 2, 3].map(item => (
      <li className="setting_button_list" key={item}>
        <button
          type="button"
          className={`setting_button ${viewerScreenSettings.columnsInPage === item ? 'active' : ''}`}
          onClick={() => onChanged && onChanged(item)}
        >{item} 단
        </button>
      </li>
    ));
  }

  render() {
    return (
      <li className="setting_list">
        <SvgIcons
          svgName="svg_column"
          svgClass="setting_title_icon svg_column_icon"
        />
        <div className="table_wrapper">
          <p className="setting_title">
            다단 보기<span className="indent_hidden">변경</span>
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

ColumnSetting.propTypes = {
  onChanged: PropTypes.func,
  viewerScreenSettings: PropTypes.object,
};

ColumnSetting.defaultProps = {
  onChanged: () => {},
  viewerScreenSettings: {},
};

const mapStateToProps = state => ({
  viewerScreenSettings: selectReaderSetting(state),
});

export default connect(mapStateToProps)(ColumnSetting);


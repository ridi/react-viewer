import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectReaderSetting,
  COLUMN_GAP_RANGE,
} from '../../../../lib';
import SvgIcons from '../icons/SvgIcons';
import SpinButton from './SpinButton';


class ColumnSetting extends Component {
  renderColumnOptionList() {
    const { onChanged } = this.props;
    const { columnsInPage, startWithBlankPage } = this.props.setting;

    return [1, 2].map(item => (
      <li className="setting_button_list" key={item}>
        <button
          type="button"
          className={`setting_button ${columnsInPage === item ? 'active' : ''}`}
          onClick={() => onChanged && onChanged({ columnsInPage: item, startWithBlankPage })}
        >{item} 단
        </button>
      </li>
    ));
  }

  renderBlankPageOptionList() {
    const { onChanged } = this.props;
    const { columnsInPage, startWithBlankPage } = this.props.setting;
    return [0, 1].map(item => (
      <li className="setting_button_list" key={item}>
        <button
          type="button"
          className={`setting_button ${startWithBlankPage === item ? 'active' : ''}`}
          onClick={() => onChanged && onChanged({ columnsInPage, startWithBlankPage: item })}
        >{item} 페이지
        </button>
      </li>
    ));
  }

  render() {
    const { columnsInPage, columnGapInPercent, onChanged } = this.props.setting;
    return (
      <React.Fragment>
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
                {this.renderColumnOptionList()}
              </ul>
            </div>
          </div>
        </li>
        { columnsInPage > 1 &&
        <li className="setting_list">
          <SvgIcons
            svgName="svg_column"
            svgClass="setting_title_icon svg_column_icon"
          />
          <div className="table_wrapper">
            <p className="setting_title">
              빈 페이지 보기<span className="indent_hidden">변경</span>
            </p>
            <div className="setting_buttons_wrapper font_family_setting">
              <ul className="setting_buttons font_family_buttons">
                {this.renderBlankPageOptionList()}
              </ul>
            </div>
          </div>
        </li>
        }
        { columnsInPage > 1 &&
        <li className="setting_list">
          <SvgIcons
            svgName="svg_column"
            svgClass="setting_title_icon svg_column_icon"
          />
          <SpinButton
            title="단 간격 (%)"
            buttonTarget="set_columnGapInPercent"
            initialValue={columnGapInPercent}
            min={COLUMN_GAP_RANGE[0]}
            max={COLUMN_GAP_RANGE[1]}
            onChange={(old, value) => onChanged({ columnGapInPercent: value })}
          />
        </li>
        }
      </React.Fragment>
    );
  }
}

ColumnSetting.propTypes = {
  onChanged: PropTypes.func,
  setting: PropTypes.object,
};

ColumnSetting.defaultProps = {
  onChanged: () => {},
  setting: {},
};

const mapStateToProps = state => ({
  setting: selectReaderSetting(state),
});

export default connect(mapStateToProps)(ColumnSetting);


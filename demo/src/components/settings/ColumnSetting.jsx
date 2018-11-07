/* eslint react/jsx-one-expression-per-line: 0, operator-linebreak: 0, react/jsx-wrap-multilines: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectReaderSetting,
  COLUMN_GAP_RANGE,
} from '@ridi/react-viewer';
import SvgIcons from '../icons/SvgIcons';
import Stepper from './Stepper';


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
    const { onChanged } = this.props;
    const { columnsInPage, columnGapInPercent } = this.props.setting;
    return (
      <>
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
          <Stepper
            title="단 간격 (%)"
            buttonTarget="set_columnGapInPercent"
            value={columnGapInPercent}
            min={COLUMN_GAP_RANGE[0]}
            max={COLUMN_GAP_RANGE[1]}
            onChange={value => onChanged({ columnGapInPercent: value })}
          />
        </li>
        }
      </>
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

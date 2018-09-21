import React from 'react';
import PropTypes from 'prop-types';
import SvgIcons from '../icons/SvgIcons';

export default class Stepper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleMinus = this.handleMinus.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
  }

  handleChange(newValue) {
    const { min, max, onChange } = this.props;
    const n = parseFloat(newValue);
    if (newValue >= min && newValue <= max) {
      onChange(n);
    }
    this.minusButton.disabled = (n === min);
    this.plusButton.disabled = (n === max);
  }

  handleMinus() {
    this.handleChange(this.props.value - 1);
    this.minusButton.blur();
  }

  handlePlus() {
    this.handleChange(this.props.value + 1);
    this.plusButton.blur();
  }

  render() {
    const {
      value,
      min,
      max,
      buttonTarget,
      title,
    } = this.props;
    return (
      <div className="table_wrapper">
        <div className="setting_title">
          {title}
          <span className="indent_hidden">변경, 현재 </span>
          <span className="setting_num">{value}</span>
        </div>
        <div className="setting_buttons_wrapper stepper_setting">
          <ul className={`stepper_button_wrapper ${buttonTarget}`}>
            <li className="stepper_button_list">
              <button
                type="button"
                className="stepper_button minus_button"
                disabled={value === min}
                onClick={this.handleMinus}
                ref={(c) => {
                  this.minusButton = c;
                }}
              >
                <SvgIcons
                  svgName="svg_minus_1"
                  svgClass="stepper_icon"
                />
                <span className="indent_hidden">감소</span>
              </button>
            </li>
            <li className="stepper_button_list">
              <input type="number" value={value} readOnly />
            </li>
            <li className="stepper_button_list">
              <button
                type="button"
                className="stepper_button plus_button"
                disabled={value === max}
                onClick={this.handlePlus}
                ref={(c) => {
                  this.plusButton = c;
                }}
              >
                <SvgIcons
                  svgName="svg_plus_1"
                  svgClass="stepper_icon"
                />
                <span className="indent_hidden">증가</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Stepper.propTypes = {
  title: PropTypes.string.isRequired,
  buttonTarget: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

Stepper.defaultProps = {
  onChange: () => {},
};

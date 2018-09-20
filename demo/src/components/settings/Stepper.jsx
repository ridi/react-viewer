import React from 'react';
import PropTypes from 'prop-types';
import SvgIcons from '../icons/SvgIcons';

// TODO 외부에서 initialValue 값이 변경되었을 경우에 대한 처리가 필요하다.
export default class SpinButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
    };
    this.handleMinus = this.handleMinus.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
  }

  handleChange() {
    const { min, max, onChange } = this.props;
    const { value } = this.state;
    const n = parseFloat(value);
    if (value >= min && value <= max) {
      onChange(null, n);
    } else {
      this.setState({
        value: Math.min(Math.max(value, min), max),
      });
    }
    this.minusButton.disabled = (n === min);
    this.plusButton.disabled = (n === max);
  }

  handleMinus() {
    const { value } = this.state;
    this.setState({ value: value - 1 }, () => this.handleChange());
    this.minusButton.blur();
  }

  handlePlus() {
    const { value } = this.state;
    this.setState({ value: value + 1 }, () => this.handleChange());
    this.plusButton.blur();
  }

  render() {
    return (
      <div className="table_wrapper">
        <div className="setting_title">
          {this.props.title}
          <span className="indent_hidden">변경, 현재 </span>
          <span className="setting_num">{this.state.value}</span>
        </div>
        <div className="setting_buttons_wrapper spin_setting">
          <ul className={`spin_button_wrapper ${this.props.buttonTarget}`}>
            <li className="spin_button_list">
              <button
                type="button"
                className="spin_button minus_button"
                disabled={this.state.value === this.props.min}
                onClick={this.handleMinus}
                ref={(c) => {
                  this.minusButton = c;
                }}
              >
                <SvgIcons
                  svgName="svg_minus_1"
                  svgClass="spin_icon"
                />
                <span className="indent_hidden">감소</span>
              </button>
            </li>
            <li className="spin_button_list">
              <input
                type="number"
                value={this.state.value}
                onKeyDown={({ key }) => {
                  if (key === 'Enter' || key === ' ') {
                    this.handleChange();
                  } else if (key === 'ArrowUp' || key === 'Up') {
                    this.handleMinus();
                  } else if (key === 'ArrowDown' || key === 'Down') {
                    this.handlePlus();
                  }
                }}
                onChange={({ target }) => this.setState({ value: target.value })}
              />
            </li>
            <li className="spin_button_list">
              <button
                type="button"
                className="spin_button plus_button"
                disabled={this.state.value === this.props.max}
                onClick={this.handlePlus}
                ref={(c) => {
                  this.plusButton = c;
                }}
              >
                <SvgIcons
                  svgName="svg_plus_1"
                  svgClass="spin_icon"
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

SpinButton.propTypes = {
  title: PropTypes.string.isRequired,
  buttonTarget: PropTypes.string.isRequired,
  initialValue: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

SpinButton.defaultProps = {
  onChange: () => {},
};

import React from 'react';
import PropTypes from 'prop-types';
import SvgIcons from '../icons/SvgIcons';


export default class SpinButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };
    this.handleMinus = this.handleMinus.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
  }

  handleMinus() {
    const oldLevel = this.state.value;
    if (this.state.value > this.props.min) {
      const newLevel = this.state.value - 1;
      this.props.onChange(oldLevel, newLevel);
      this.setState({ value: newLevel });

      this.minusButton.disabled = (newLevel === this.props.min);
      this.plusButton.disabled = false;
    }

    this.minusButton.blur();
  }

  handlePlus() {
    const oldLevel = this.state.value;
    if (this.state.value < this.props.max) {
      const newLevel = this.state.value + 1;
      this.props.onChange(oldLevel, newLevel);
      this.setState({ value: newLevel });

      this.minusButton.disabled = false;
      this.plusButton.disabled = (newLevel === this.props.max);
    }

    this.plusButton.blur();
  }

  render() {
    return (
      <div className="table_wrapper">
        <div className="setting_title">{this.props.title}
          <span className="indent_hidden">변경, 현재 </span><span className="setting_num">{this.state.value}</span>
        </div>
        <div className="setting_buttons_wrapper spin_setting">
          <ul className={`spin_button_wrapper ${this.props.buttonTarget}`}>
            <li className="spin_button_list">
              <button
                type="button"
                className="spin_button minus_button"
                disabled={this.state.value === this.props.min}
                onClick={this.handleMinus}
                ref={c => {
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
              <button
                type="button"
                className="spin_button plus_button"
                disabled={this.state.value === this.props.max}
                onClick={this.handlePlus}
                ref={c => {
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
  onChange: PropTypes.func
};

SpinButton.defaultProps = {
  onChange: () => {},
};

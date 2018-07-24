/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { debounce } from '../../util/Util';
import CalculationsConnector from '../../util/connector/CalculationsConnector';
import { selectCurrent, selectIsCalculated, selectSetting } from '../../redux/selector';
import { Position } from '../screen/BaseTouchable';
import { CurrentType, SettingType } from '../prop-types';

export default class BaseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }

  componentDidMount() {
    const { isCalculated, disableCalculation } = this.props;
    if (isCalculated && !disableCalculation) {
      CalculationsConnector.restoreCurrentOffset();
    }
    this.moveToOffset();

    this.resizeViewer = debounce(() => {
      if (!disableCalculation) {
        CalculationsConnector.invalidate();
      }
    }, DOMEventDelayConstants.RESIZE);
    window.addEventListener('resize', this.resizeViewer);
  }

  componentDidUpdate(prevProps) {
    const { isCalculated: prevIsCalculated, current: prevCurrent } = prevProps;
    const { isCalculated, current } = this.props;
    if (isCalculated) {
      if (!prevIsCalculated) {
        CalculationsConnector.restoreCurrentOffset();
        this.moveToOffset();
      } else if (prevCurrent.offset !== current.offset) {
        this.moveToOffset();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeViewer);
  }

  onTouchableScreenTouched({ position }) {
    if (position === Position.MIDDLE) {
      const { onTouched } = this.props;
      onTouched();
    }
  }

  getTouchableScreen() {
    return null;
  }

  moveToOffset() {}

  renderContents() { return null; }

  renderFooter() { return null; }

  render() {
    const TouchableScreen = this.getTouchableScreen();
    return (
      <TouchableScreen
        ref={this.wrapper}
        onTouched={position => this.onTouchableScreenTouched(position)}
      >
        { this.renderContents() }
        { this.renderFooter() }
      </TouchableScreen>
    );
  }
}

BaseScreen.defaultProps = {
  onTouched: () => {},
};

BaseScreen.propTypes = {
  isCalculated: PropTypes.bool.isRequired,
  onTouched: PropTypes.func,
  disableCalculation: PropTypes.bool.isRequired,
  setting: SettingType.isRequired,
  maxWidth: PropTypes.number.isRequired,
  current: CurrentType.isRequired,
};

export const mapStateToProps = state => ({
  isCalculated: selectIsCalculated(state),
  setting: selectSetting(state),
  current: selectCurrent(state),
});

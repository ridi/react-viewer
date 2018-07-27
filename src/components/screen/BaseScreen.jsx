/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { debounce } from '../../util/Util';
import CalculationsConnector from '../../util/connector/CalculationsConnector';
import {
  selectReaderContents,
  selectReaderCurrent,
  selectReaderIsCalculated,
  selectReaderSetting,
  selectReaderCalculationsTotal,
} from '../../redux/selector';
import { Position } from '../screen/BaseTouchable';
import { ContentType, CurrentType, SettingType } from '../prop-types';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { updateContent, updateContentError } from '../../redux/action';

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

    this.resizeReader = debounce(() => {
      if (!disableCalculation) {
        CalculationsConnector.invalidate();
      }
    }, DOMEventDelayConstants.RESIZE);
    window.addEventListener(DOMEventConstants.RESIZE, this.resizeReader);
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
    window.removeEventListener(DOMEventConstants.RESIZE, this.resizeReader);
  }

  onTouchableScreenTouched({ position }) {
    if (position === Position.MIDDLE) {
      const { onTouched } = this.props;
      onTouched();
    }
  }

  onContentLoaded(index, content) {
    const { contents, actionUpdateContent } = this.props;
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);
    actionUpdateContent(index, content, isAllLoaded);
  }

  onContentError(index, error) {
    const { contents, actionUpdateContentError } = this.props;
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);
    actionUpdateContentError(index, error, isAllLoaded);
  }

  getTouchableScreen() {
    return null;
  }

  moveToOffset() {}

  renderContents() { return null; }

  renderFooter() { return null; }

  render() {
    const { calculationsTotal } = this.props;
    const TouchableScreen = this.getTouchableScreen();
    return (
      <TouchableScreen
        ref={this.wrapper}
        total={calculationsTotal}
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
  contents: PropTypes.arrayOf(ContentType).isRequired,
  actionUpdateContent: PropTypes.func.isRequired,
  actionUpdateContentError: PropTypes.func.isRequired,
  calculationsTotal: PropTypes.number.isRequired,
};

export const mapStateToProps = state => ({
  isCalculated: selectReaderIsCalculated(state),
  setting: selectReaderSetting(state),
  current: selectReaderCurrent(state),
  contents: selectReaderContents(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
});

export const mapDispatchToProps = dispatch => ({
  actionUpdateContent: (index, content, isAllLoaded) => dispatch(updateContent(index, content, isAllLoaded)),
  actionUpdateContentError: (index, error, isAllLoaded) => dispatch(updateContentError(index, error, isAllLoaded)),
});

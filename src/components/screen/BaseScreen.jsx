/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { debounce } from '../../util/Util';
import {
  selectReaderContents,
  selectReaderCurrent,
  selectReaderIsCalculated,
  selectReaderSetting,
  selectReaderCalculationsTotal,
} from '../../redux/selector';
import { Position } from '../screen/BaseTouchable';
import PropTypes, { ContentType, CurrentType, SettingType } from '../prop-types';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { updateContent, updateContentError } from '../../redux/action';
import Connector from '../../util/connector/';

export default class BaseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();

    this.onContentLoaded = this.onContentLoaded.bind(this);
    this.onContentError = this.onContentError.bind(this);
  }

  componentDidMount() {
    const { isCalculated, disableCalculation } = this.props;
    if (isCalculated && !disableCalculation) {
      Connector.current.restoreCurrentOffset();
    }
    this.moveToOffset();

    this.resizeReader = debounce(() => {
      if (!disableCalculation) {
        Connector.calculations.invalidate();
      }
    }, DOMEventDelayConstants.RESIZE);
    window.addEventListener(DOMEventConstants.RESIZE, this.resizeReader);

    Connector.current.setReaderJs();
  }

  componentDidUpdate(prevProps) {
    const { isCalculated: prevIsCalculated, current: prevCurrent } = prevProps;
    const { isCalculated, current } = this.props;
    if (isCalculated) {
      if (!prevIsCalculated) {
        Connector.current.restoreCurrentOffset();
        this.moveToOffset();
      } else if (prevCurrent.offset !== current.offset) {
        this.moveToOffset();
      }
    }
    Connector.current.setReaderJs();
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

/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { debounce } from '../../util/Util';
import {
  selectReaderContents,
  selectReaderCurrent,
  selectReaderIsCalculated,
  selectReaderSetting,
  selectReaderCalculationsTotal, selectReaderContentFormat,
} from '../../redux/selector';
import PropTypes, { ContentType, CurrentType, SettingType } from '../prop-types';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { updateContent, updateContentError } from '../../redux/action';
import Connector from '../../util/connector';
import TouchableScreen from './TouchableScreen';
import { addEventListener, removeEventListener } from '../../util/BrowserWrapper';
import { getStyledTouchable } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';

export default class BaseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();

    this.onContentLoaded = this.onContentLoaded.bind(this);
    this.onContentError = this.onContentError.bind(this);
    this.onTouchableScreenTouched = this.onTouchableScreenTouched.bind(this);
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
    addEventListener(window, DOMEventConstants.RESIZE, this.resizeReader);
  }

  componentDidUpdate(prevProps) {
    const { isCalculated: prevIsCalculated, current: prevCurrent } = prevProps;
    const { isCalculated, current } = this.props;

    if (isCalculated) {
      const isCurrentMoved = prevCurrent.offset !== current.offset
        || prevCurrent.contentIndex !== current.contentIndex
        || prevCurrent.viewType !== current.viewType;
      const isNeededRestore = !prevIsCalculated;
      const isNeededMoveToOffset = isNeededRestore || isCurrentMoved;
      const isNeededUpdateReaderJs = prevCurrent.contentIndex !== current.contentIndex
        || prevCurrent.viewType !== current.viewType;

      if (isNeededRestore) Connector.current.restoreCurrentOffset();
      if (isNeededMoveToOffset) this.moveToOffset();
      if (isNeededUpdateReaderJs) Connector.current.setReaderJs();
    }
  }

  componentWillUnmount() {
    removeEventListener(window, DOMEventConstants.RESIZE, this.resizeReader);
  }

  onTouchableScreenTouched(event) {
    const { onTouched } = this.props;
    onTouched(event);
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

  moveToOffset() {}

  renderContents() { return null; }

  renderFooter() { return null; }

  render() {
    const { setting, calculationsTotal, contentFormat } = this.props;
    return (
      <TouchableScreen
        ref={this.wrapper}
        total={calculationsTotal}
        onTouched={this.onTouchableScreenTouched}
        viewType={setting.viewType}
        StyledTouchable={getStyledTouchable(contentFormat, setting.viewType)}
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
  contentFormat: PropTypes.oneOf(ContentFormat.toList()).isRequired,
};

export const mapStateToProps = state => ({
  isCalculated: selectReaderIsCalculated(state),
  setting: selectReaderSetting(state),
  current: selectReaderCurrent(state),
  contents: selectReaderContents(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  contentFormat: selectReaderContentFormat(state),
});

export const mapDispatchToProps = dispatch => ({
  actionUpdateContent: (index, content, isAllLoaded) => dispatch(updateContent(index, content, isAllLoaded)),
  actionUpdateContentError: (index, error, isAllLoaded) => dispatch(updateContentError(index, error, isAllLoaded)),
});

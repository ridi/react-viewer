/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { debounce } from '../../util/Util';
import {
  selectReaderContents,
  selectReaderCurrent,
  selectReaderSetting,
  selectReaderCalculationsTotal, selectReaderContentFormat, selectReaderIsReadyToRead,
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
    const { isReadyToRead, disableCalculation } = this.props;
    if (isReadyToRead && !disableCalculation) {
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
    const { current: prevCurrent, isReadyToRead: prevIsReadyToRead } = prevProps;
    const { current, isReadyToRead } = this.props;

    const hasJustCalculatedCurrent = !prevIsReadyToRead && isReadyToRead;
    const isCurrentMoved = (prevCurrent.offset !== current.offset
      || prevCurrent.contentIndex !== current.contentIndex
      || prevCurrent.viewType !== current.viewType);
    const isNeededRestore = hasJustCalculatedCurrent;
    const isNeededMoveToOffset = hasJustCalculatedCurrent || isCurrentMoved;
    const isNeededUpdateReaderJs = prevCurrent.contentIndex !== current.contentIndex
      || prevCurrent.viewType !== current.viewType;

    if (isNeededRestore) Connector.current.restoreCurrentOffset();
    if (isNeededMoveToOffset) this.moveToOffset();
    if (isNeededUpdateReaderJs) Connector.current.setReaderJs();
  }

  componentWillUnmount() {
    removeEventListener(window, DOMEventConstants.RESIZE, this.resizeReader);
  }

  onTouchableScreenTouched(event) {
    const { onTouched, isReadyToRead } = this.props;
    if (!isReadyToRead) return;
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

  renderLoading() {
    const { isReadyToRead } = this.props;
    if (!isReadyToRead) {
      return (
        // TODO change to property
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            textAlign: 'center',
            width: '100%',
            height: '100vh',
            backgroundColor: '#fff',
          }}
        >
          <p style={{ position: 'relative', top: '50%' }}>Loading...</p>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      setting,
      calculationsTotal,
      contentFormat,
      isReadyToRead,
      children,
    } = this.props;
    return (
      <TouchableScreen
        ref={this.wrapper}
        total={calculationsTotal}
        onTouched={this.onTouchableScreenTouched}
        viewType={setting.viewType}
        StyledTouchable={getStyledTouchable(contentFormat, setting.viewType)}
        isReadyToRead={isReadyToRead}
      >
        { this.renderContents() }
        { this.renderFooter() }
        { this.renderLoading() }
        { children }
      </TouchableScreen>
    );
  }
}

BaseScreen.defaultProps = {
  onTouched: () => {},
  children: null,
};

BaseScreen.propTypes = {
  onTouched: PropTypes.func,
  disableCalculation: PropTypes.bool.isRequired,
  setting: SettingType.isRequired,
  current: CurrentType.isRequired,
  contents: PropTypes.arrayOf(ContentType).isRequired,
  actionUpdateContent: PropTypes.func.isRequired,
  actionUpdateContentError: PropTypes.func.isRequired,
  calculationsTotal: PropTypes.number.isRequired,
  contentFormat: PropTypes.oneOf(ContentFormat.toList()).isRequired,
  isReadyToRead: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export const mapStateToProps = state => ({
  setting: selectReaderSetting(state),
  current: selectReaderCurrent(state),
  contents: selectReaderContents(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  contentFormat: selectReaderContentFormat(state),
  isReadyToRead: selectReaderIsReadyToRead(state),
});

export const mapDispatchToProps = dispatch => ({
  actionUpdateContent: (index, content, isAllLoaded) => dispatch(updateContent(index, content, isAllLoaded)),
  actionUpdateContentError: (index, error, isAllLoaded) => dispatch(updateContentError(index, error, isAllLoaded)),
});

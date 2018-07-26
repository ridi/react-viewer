import React from 'react';
import { connect } from 'react-redux';
import ReaderPageScreen from './screen/HtmlPageScreen';
import ReaderScrollScreen from './screen/HtmlScrollScreen';
import { selectReaderContentFormat, selectReaderSetting } from '../redux/selector';
import PropTypes, { SettingType } from './prop-types';
import { ContentFormat } from '../constants/ContentConstants';
import { ViewType } from '../constants/SettingConstants';
import { onScreenTouched } from '../redux/action';
import SpineCalculator from '../util/connector/CalculationsConnector';
import { isExist } from '../util/Util';
import ReaderImageScrollScreen from './screen/ImageScrollScreen';
import ReaderImagePageScreen from './screen/ImagePageScreen';
import { PAGE_MAX_WIDTH } from '../constants/StyledConstants';

class Reader extends React.Component {
  constructor(props) {
    super(props);
    SpineCalculator.setHasFooter(!!props.footer);
  }

  componentDidMount() {
    const { onMount } = this.props;
    if (isExist(onMount)) {
      onMount();
    }
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    if (isExist(onUnmount)) {
      onUnmount();
    }
  }

  onScreenTouched() {
    const {
      actionToggleFullScreen,
      onTouched,
    } = this.props;
    actionToggleFullScreen();
    if (isExist(onTouched)) {
      onTouched();
    }
  }

  getScreen() {
    const { viewType } = this.props.setting;
    const { contentFormat } = this.props;

    if (viewType === ViewType.SCROLL) {
      if (contentFormat === ContentFormat.HTML) {
        return ReaderScrollScreen;
      }
      return ReaderImageScrollScreen;
    }

    if (contentFormat === ContentFormat.HTML) {
      return ReaderPageScreen;
    }
    return ReaderImagePageScreen;
  }

  render() {
    const {
      maxWidth,
      footer,
      contentFooter,
      onMoveWrongDirection,
      ignoreScroll,
      disableCalculation,
    } = this.props;

    const props = {
      maxWidth,
      footer,
      contentFooter,
      ignoreScroll,
      disableCalculation,
      onTouched: () => this.onScreenTouched(),
      onMoveWrongDirection,
    };
    const Screen = this.getScreen();
    return <Screen {...props} />;
  }
}

Reader.defaultProps = {
  footer: null,
  contentFooter: null,
  onTouched: null,
  onMoveWrongDirection: null,
  onMount: null,
  onUnmount: null,
  ignoreScroll: false,
  disableCalculation: false,
  maxWidth: PAGE_MAX_WIDTH,
};

Reader.propTypes = {
  setting: SettingType,
  footer: PropTypes.node,
  contentFooter: PropTypes.node,
  actionToggleFullScreen: PropTypes.func.isRequired,
  onTouched: PropTypes.func,
  onMoveWrongDirection: PropTypes.func,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  ignoreScroll: PropTypes.bool,
  disableCalculation: PropTypes.bool, // TODO 꼭 필요한지 고민 필요
  contentFormat: PropTypes.oneOf(ContentFormat.toList()).isRequired,
  maxWidth: PropTypes.number,
};

const mapStateToProps = state => ({
  setting: selectReaderSetting(state),
  contentFormat: selectReaderContentFormat(state),
});

const mapDispatchToProps = dispatch => ({
  actionToggleFullScreen: () => dispatch(onScreenTouched()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reader);

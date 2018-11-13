import React from 'react';
import { connect } from 'react-redux';
import ReaderPageScreen from './screen/HtmlPageScreen';
import ReaderScrollScreen from './screen/HtmlScrollScreen';
import { selectReaderContentFormat, selectReaderSetting } from '../redux/selector';
import PropTypes, { SettingType } from './prop-types';
import { ContentFormat } from '../constants/ContentConstants';
import { ViewType } from '../constants/SettingConstants';
import Events from '../constants/DOMEventConstants';
import Connector from '../service/connector';
import { isExist } from '../util/Util';
import { addEventListener, removeEventListener } from '../util/EventHandler';
import ReaderImageScrollScreen from './screen/ImageScrollScreen';
import ReaderImagePageScreen from './screen/ImagePageScreen';
import ContentFooter from './footer/ContentFooter';

class Reader extends React.Component {
  constructor(props) {
    super(props);
    Connector.calculations.setHasFooter(!!props.footer);
    this.onTouched = this.onTouched.bind(this);
    this.onScrolled = this.onScrolled.bind(this);
  }

  componentDidMount() {
    const { onMount, onUnmount } = this.props;
    if (isExist(onMount)) {
      onMount();
    }
    if (isExist(onUnmount)) {
      addEventListener(window, Events.BEFORE_UNLOAD, onUnmount);
    }
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    if (isExist(onUnmount)) {
      onUnmount();
      removeEventListener(window, Events.BEFORE_UNLOAD, onUnmount);
    }
  }

  onTouched(e) {
    const {
      onTouched,
    } = this.props;
    if (isExist(onTouched)) {
      onTouched(e);
    }
  }

  onScrolled(e) {
    const { onScrolled } = this.props;
    if (isExist(onScrolled)) {
      onScrolled(e);
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
      footer,
      contentFooter,
      ignoreScroll,
      disableCalculation,
      selectable,
      annotationable,
      annotations,
      onSelectionChanged,
      onAnnotationTouched,
      children,
    } = this.props;

    const props = {
      footer,
      contentFooter,
      ignoreScroll,
      disableCalculation,
      onTouched: this.onTouched,
      onScrolled: this.onScrolled,
      selectable,
      annotationable,
      annotations,
      onSelectionChanged,
      onAnnotationTouched,
    };

    if (contentFooter) {
      props.contentFooter = <ContentFooter content={contentFooter} />;
    }
    const Screen = this.getScreen();
    return <Screen {...props}>{children}</Screen>;
  }
}

Reader.defaultProps = {
  footer: null,
  contentFooter: null,
  ignoreScroll: false,
  disableCalculation: false,
  onScrolled: null,
  onMount: null,
  onUnmount: null,
  onTouched: null,
  selectable: false,
  annotationable: false,
  annotations: [],
  onSelectionChanged: null,
  onAnnotationTouched: null,
  children: null,
};

Reader.propTypes = {
  setting: SettingType,
  footer: PropTypes.node,
  contentFooter: PropTypes.node,
  ignoreScroll: PropTypes.bool,
  disableCalculation: PropTypes.bool,
  contentFormat: PropTypes.oneOf(ContentFormat.toList()).isRequired,
  onTouched: PropTypes.func,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onScrolled: PropTypes.func,
  selectable: PropTypes.bool,
  annotationable: PropTypes.bool,
  annotations: PropTypes.array,
  onSelectionChanged: PropTypes.func,
  onAnnotationTouched: PropTypes.func,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  setting: selectReaderSetting(state),
  contentFormat: selectReaderContentFormat(state),
});

export default connect(mapStateToProps)(Reader);

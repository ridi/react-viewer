import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderFooterCalculations,
} from '../../redux/selector';
import Footer from '../footer/Footer';
import { screenHeight, screenWidth, scrollTop, setScrollTop } from '../../util/BrowserWrapper';
import { onScreenScrolled } from '../../redux/action';
import PropTypes, {
  FooterCalculationsType,
  ContentCalculationsType,
} from '../prop-types';
import BaseScreen, {
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
  mapStateToProps as readerBaseScreenMapStateToProps,
} from './BaseScreen';
import { debounce } from '../../util/Util';
import ScrollTouchable from './ScrollTouchable';
import Connector from '../../util/connector/index';
import ScrollHtmlContent from '../content/ScrollHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import DOMEventConstants from '../../constants/DOMEventConstants';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';

class HtmlScrollScreen extends BaseScreen {
  componentDidMount() {
    super.componentDidMount();

    this.onScroll = debounce(e => this.onScrollHandle(e), DOMEventDelayConstants.SCROLL);
    window.addEventListener(DOMEventConstants.SCROLL, this.onScroll);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener(DOMEventConstants.SCROLL, this.onScroll);
  }

  onScrollHandle(e) {
    e.preventDefault();
    e.stopPropagation();

    const { ignoreScroll, actionOnScreenScrolled } = this.props;
    if (ignoreScroll) {
      return;
    }
    actionOnScreenScrolled();
    Connector.calculations.updateCurrentPosition(scrollTop());
  }

  calculate(index, nodeInfo) {
    Connector.calculations.setTotal(index, nodeInfo.scrollHeight);
  }

  getWidth() {
    const { maxWidth } = this.props;
    const { containerHorizontalMargin } = this.props.setting;
    return Math.min(screenWidth() - (containerHorizontalMargin * 2), maxWidth);
  }

  moveToOffset() {
    const { offset } = this.props.current;
    setScrollTop(offset);
  }

  getTouchableScreen() {
    return ScrollTouchable;
  }

  needRender(content) {
    const { current } = this.props;
    const calculated = Connector.calculations.isCalculated(content.index);
    const [top, height] = [current.offset, screenHeight()];
    const contentIndexesInScreen = Connector.calculations.getContentIndexesInOffsetRange(top - (height * 2), top + height + (height * 2));
    return !calculated || contentIndexesInScreen.includes(content.index);
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    return (
      <Footer
        content={footer}
        onContentRendered={footerNode => Connector.calculations.setTotal(FOOTER_INDEX, footerNode.scrollHeight)}
        containerVerticalMargin={containerVerticalMargin}
        startOffset={Connector.calculations.getStartOffset(FOOTER_INDEX)}
      />
    );
  }

  renderContent(content) {
    const {
      current,
      setting,
      contentFooter,
    } = this.props;
    const startOffset = Connector.calculations.getStartOffset(content.index);
    return (
      <ScrollHtmlContent
        key={`${content.uri}:${content.index}`}
        content={content}
        startOffset={startOffset}
        isCalculated={Connector.calculations.isCalculated(content.index)}
        currentOffset={current.offset}
        setting={setting}
        width={this.getWidth()}
        containerHorizontalMargin={(screenWidth() - this.getWidth()) / 2}
        containerVerticalMargin={setting.containerVerticalMargin}
        onContentLoaded={(index, c) => this.onContentLoaded(index, c)}
        onContentError={(index, error) => this.onContentError(index, error)}
        onContentRendered={(index, nodeInfo) => this.calculate(index, nodeInfo)}
        contentFooter={Connector.calculations.isLastContent(content.index) ? contentFooter : null}
      />
    );
  }

  renderContents() {
    const { contents } = this.props;
    return contents
      .filter(content => this.needRender(content))
      .map(content => this.renderContent(content));
  }
}

HtmlScrollScreen.defaultProps = {
  ...BaseScreen.defaultProps,
  contentFooter: null,
};

HtmlScrollScreen.propTypes = {
  ...BaseScreen.propTypes,
  contentsCalculations: PropTypes.arrayOf(ContentCalculationsType),
  calculationsTotal: PropTypes.number.isRequired,
  actionUpdateContent: PropTypes.func.isRequired,
  actionUpdateContentError: PropTypes.func.isRequired,
  footerCalculations: FooterCalculationsType.isRequired,
  contentFooter: PropTypes.node,
  actionOnScreenScrolled: PropTypes.func.isRequired,
  ignoreScroll: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  contentsCalculations: selectReaderContentsCalculations(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  footerCalculations: selectReaderFooterCalculations(state),
});

const mapDispatchToProps = dispatch => ({
  ...readerBaseScreenMapDispatchToProps(dispatch),
  actionOnScreenScrolled: () => dispatch(onScreenScrolled()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HtmlScrollScreen);

import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderFooterCalculations,
} from '../../redux/selector';
import Footer from '../footer/Footer';
import {
  screenHeight,
  scrollTop,
  setScrollTop,
  waitThenRun,
} from '../../util/BrowserWrapper';
import {
  addEventListener,
  removeEventListener,
} from '../../util/EventHandler';
import PropTypes, {
  FooterCalculationsType,
  ContentCalculationsType,
} from '../prop-types';
import BaseScreen, {
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
  mapStateToProps as readerBaseScreenMapStateToProps,
} from './BaseScreen';
import { debounce } from '../../util/Util';
import Connector from '../../service/connector';
import ScrollHtmlContent from '../content/ScrollHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import DOMEventConstants from '../../constants/DOMEventConstants';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { INVALID_OFFSET, READERJS_CONTENT_WRAPPER, ViewType } from '../../constants/SettingConstants';
import { getStyledContent, getStyledFooter } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';

class HtmlScrollScreen extends BaseScreen {
  static defaultProps = {
    ...BaseScreen.defaultProps,
    contentFooter: null,
  };

  static propTypes = {
    ...BaseScreen.propTypes,
    contentsCalculations: PropTypes.arrayOf(ContentCalculationsType),
    calculationsTotal: PropTypes.number.isRequired,
    actionUpdateContent: PropTypes.func.isRequired,
    actionUpdateContentError: PropTypes.func.isRequired,
    footerCalculations: FooterCalculationsType.isRequired,
    contentFooter: PropTypes.node,
    onScrolled: PropTypes.func.isRequired,
    ignoreScroll: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.onScroll = debounce(e => this.onScrollHandle(e), DOMEventDelayConstants.SCROLL);
    addEventListener(window, DOMEventConstants.SCROLL, this.onScroll, { passive: true });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    removeEventListener(window, DOMEventConstants.SCROLL, this.onScroll, { passive: true });
  }

  onScrollHandle(e) {
    const { ignoreScroll, onScrolled, isReadyToRead } = this.props;
    if (ignoreScroll || !isReadyToRead) return;
    onScrolled(e);
    Connector.current.updateCurrentOffset(scrollTop());
  }

  calculate(index, node) {
    if (index === FOOTER_INDEX) {
      Connector.calculations.setContentTotal(FOOTER_INDEX, node.offsetHeight);
    }
    const isLastContent = Connector.calculations.isLastContent(index);
    const { contentFooter } = this.props;
    waitThenRun(() => Connector.calculations.setContentTotal(
      index,
      node.scrollHeight + (isLastContent && contentFooter ? Connector.setting.getContentFooterHeight() : 0),
    ));
  }

  moveToOffset() {
    super.moveToOffset();
    const { offset } = this.props.current;
    setScrollTop(offset);
  }

  needRender(contentIndex) {
    const { current } = this.props;
    const calculated = Connector.calculations.isContentCalculated(contentIndex);
    const [top, height] = [current.offset, screenHeight()];
    const contentIndexesInScreen = Connector.calculations.getContentIndexesInOffsetRange(top - (height * 2), top + height + (height * 2));
    return calculated && contentIndexesInScreen.includes(contentIndex);
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    return (
      <Footer
        key="footer"
        content={footer}
        onContentRendered={this.calculate}
        containerVerticalMargin={containerVerticalMargin}
        startOffset={Connector.calculations.getStartOffset(FOOTER_INDEX)}
        StyledFooter={getStyledFooter(ContentFormat.HTML, ViewType.SCROLL)}
      />
    );
  }

  renderContent(content, StyledContent) {
    const {
      current,
      contentFooter,
    } = this.props;
    const startOffset = Connector.calculations.getStartOffset(content.index);
    const isCurrentContent = current.contentIndex === content.index;
    const isLastContent = Connector.calculations.isLastContent(content.index);
    const isCalculated = Connector.calculations.isContentCalculated(content.index);

    return (
      <ScrollHtmlContent
        className={isCurrentContent ? READERJS_CONTENT_WRAPPER : null}
        key={`${content.uri}:${content.index}`}
        content={content}
        isCalculated={isCalculated}
        startOffset={startOffset}
        localOffset={isCurrentContent ? current.offset - startOffset : INVALID_OFFSET}
        onContentLoaded={this.onContentLoaded}
        onContentError={this.onContentError}
        onContentRendered={this.calculate}
        contentFooter={isLastContent ? contentFooter : null}
        StyledContent={StyledContent}
        onContentMount={this.onContentMount}
      />
    );
  }

  renderContents() {
    const { contents } = this.props;
    const StyledContent = getStyledContent(ContentFormat.HTML, ViewType.SCROLL);
    const calculatedTarget = Connector.calculations.getCalculationTargetContents();
    return contents
      .filter(({ index }) => this.needRender(index) || calculatedTarget.includes(index))
      .map(content => this.renderContent(content, StyledContent));
  }
}

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  contentsCalculations: selectReaderContentsCalculations(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  footerCalculations: selectReaderFooterCalculations(state),
});

const mapDispatchToProps = dispatch => ({
  ...readerBaseScreenMapDispatchToProps(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HtmlScrollScreen);

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
  addEventListener,
  removeEventListener,
} from '../../util/BrowserWrapper';
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
import Connector from '../../util/connector';
import ScrollHtmlContent from '../content/ScrollHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import DOMEventConstants from '../../constants/DOMEventConstants';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { INVALID_OFFSET, READERJS_CONTENT_WRAPPER, ViewType } from '../../constants/SettingConstants';
import { getStyledContent, getStyledFooter } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';

class HtmlScrollScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.onScroll = debounce(e => this.onScrollHandle(e), DOMEventDelayConstants.SCROLL);
    addEventListener(window, DOMEventConstants.SCROLL, this.onScroll, { passive: true });
    this.onFooterRendered = this.onFooterRendered.bind(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    removeEventListener(window, DOMEventConstants.SCROLL, this.onScroll, { passive: true });
  }

  onScrollHandle() {
    const { ignoreScroll, actionOnScreenScrolled } = this.props;
    if (ignoreScroll) {
      return;
    }
    actionOnScreenScrolled();
    Connector.current.updateCurrentPosition(scrollTop());
  }

  calculate(index, nodeInfo) {
    const waitThenRun = window.requestAnimationFrame || window.setTimeout;
    waitThenRun(() => Connector.calculations.setTotal(index, nodeInfo.scrollHeight));
  }

  moveToOffset() {
    const { offset } = this.props.current;
    setScrollTop(offset);
  }

  needRender(content) {
    const { current } = this.props;
    const calculated = Connector.calculations.isCalculated(content.index);
    const [top, height] = [current.offset, screenHeight()];
    const contentIndexesInScreen = Connector.calculations.getContentIndexesInOffsetRange(top - (height * 2), top + height + (height * 2));
    return !calculated || contentIndexesInScreen.includes(content.index);
  }

  onFooterRendered(footerNode) {
    if (!Connector.calculations.isCalculated(FOOTER_INDEX)) {
      Connector.calculations.setTotal(FOOTER_INDEX, footerNode.scrollHeight);
    }
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    return (
      <Footer
        content={footer}
        onContentRendered={this.onFooterRendered}
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
    return (
      <ScrollHtmlContent
        className={isCurrentContent ? READERJS_CONTENT_WRAPPER : null}
        key={`${content.uri}:${content.index}`}
        content={content}
        isCalculated={Connector.calculations.isCalculated(content.index)}
        startOffset={startOffset}
        localOffset={isCurrentContent ? current.offset - startOffset : INVALID_OFFSET}
        onContentLoaded={this.onContentLoaded}
        onContentError={this.onContentError}
        onContentRendered={this.calculate}
        contentFooter={isLastContent ? contentFooter : null}
        StyledContent={StyledContent}
      />
    );
  }

  renderContents() {
    const { contents } = this.props;
    const StyledContent = getStyledContent(ContentFormat.HTML, ViewType.SCROLL);
    return contents
      .filter(content => this.needRender(content))
      .map(content => this.renderContent(content, StyledContent));
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

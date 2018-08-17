import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderContentsCalculations,
  selectReaderFooterCalculations,
  selectReaderBindingType,
  selectReaderCalculationsTotal,
} from '../../redux/selector';
import { setScrollTop } from '../../util/BrowserWrapper';
import PropTypes, { FooterCalculationsType, ContentCalculationsType } from '../prop-types';
import BaseScreen, {
  mapStateToProps as readerBaseScreenMapStateToProps,
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
} from './BaseScreen';
import Connector from '../../util/connector';
import Footer from '../footer/Footer';
import { BindingType, ContentFormat } from '../../constants/ContentConstants';
import PageHtmlContent from '../content/PageHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import { INVALID_OFFSET, READERJS_CONTENT_WRAPPER, ViewType } from '../../constants/SettingConstants';
import { getStyledContent, getStyledFooter } from '../styled';

class HtmlPageScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.onContentFooterRendered = this.onContentFooterRendered.bind(this);
  }

  calculate(index, nodeInfo) {
    const waitThenRun = window.requestAnimationFrame || window.setTimeout;
    waitThenRun(() => {
      const pagesTotal = Math.ceil(nodeInfo.scrollWidth
        / (Connector.setting.getContainerWidth() + Connector.setting.getColumnGap()));
      Connector.calculations.setTotal(index, pagesTotal);
    });
  }

  moveToOffset() {
    const { contentIndex } = this.props.current;
    setScrollTop(0);
    if (contentIndex === FOOTER_INDEX) {
      this.wrapper.current.scrollLeft = this.wrapper.current.scrollWidth;
    } else {
      this.wrapper.current.scrollLeft = 0;
    }
  }

  onContentFooterRendered() {
    const hasFooter = Connector.calculations.getHasFooter();
    Connector.calculations.setTotal(FOOTER_INDEX, hasFooter ? 1 : 0);
  }

  needRender(content) {
    const { current } = this.props;
    const calculated = Connector.calculations.isCalculated(content.index);
    const visible = current.contentIndex === content.index;
    return visible || !calculated;
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    const startOffset = Connector.calculations.getStartOffset(FOOTER_INDEX);

    return (
      <Footer
        content={footer}
        startOffset={startOffset}
        onContentRendered={this.onContentFooterRendered}
        containerVerticalMargin={containerVerticalMargin}
        StyledFooter={getStyledFooter(ContentFormat.HTML, ViewType.PAGE)}
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
      <PageHtmlContent
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
    const StyledContent = getStyledContent(ContentFormat.HTML, ViewType.PAGE);
    return contents
      .filter(content => this.needRender(content))
      .map(content => this.renderContent(content, StyledContent));
  }
}

HtmlPageScreen.defaultProps = {
  ...BaseScreen.defaultProps,
  footer: null,
  contentFooter: null,
};

HtmlPageScreen.propTypes = {
  ...BaseScreen.propTypes,
  contentsCalculations: PropTypes.arrayOf(ContentCalculationsType).isRequired,
  footer: PropTypes.node,
  contentFooter: PropTypes.node,
  footerCalculations: FooterCalculationsType.isRequired,
  bindingType: PropTypes.oneOf(BindingType.toList()).isRequired,
  calculationsTotal: PropTypes.number.isRequired,
  onMoveWrongDirection: PropTypes.func,
};

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  contentsCalculations: selectReaderContentsCalculations(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  footerCalculations: selectReaderFooterCalculations(state),
  bindingType: selectReaderBindingType(state),
});

const mapDispatchToProps = dispatch => ({
  ...readerBaseScreenMapDispatchToProps(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HtmlPageScreen);

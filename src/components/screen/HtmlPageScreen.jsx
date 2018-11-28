import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderContentsCalculations,
  selectReaderFooterCalculations,
  selectReaderBindingType,
  selectReaderCalculationsTotal, selectReaderCalculationsTargets,
} from '../../redux/selector';
import { setScrollTop, waitThenRun } from '../../util/BrowserWrapper';
import PropTypes, { FooterCalculationsType, ContentCalculationsType } from '../prop-types';
import BaseScreen, {
  mapStateToProps as readerBaseScreenMapStateToProps,
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
} from './BaseScreen';
import Connector from '../../service/connector';
import Footer from '../footer/Footer';
import { BindingType, ContentFormat } from '../../constants/ContentConstants';
import PageHtmlContent from '../content/PageHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import { INVALID_OFFSET, ViewType } from '../../constants/SettingConstants';
import { getStyledContent, getStyledFooter } from '../styled';

class HtmlPageScreen extends BaseScreen {
  static defaultProps = {
    ...BaseScreen.defaultProps,
    footer: null,
    contentFooter: null,
  };

  static propTypes = {
    ...BaseScreen.propTypes,
    contentsCalculations: PropTypes.arrayOf(ContentCalculationsType).isRequired,
    footer: PropTypes.node,
    contentFooter: PropTypes.node,
    footerCalculations: FooterCalculationsType.isRequired,
    bindingType: PropTypes.oneOf(BindingType.toList()).isRequired,
    calculationsTotal: PropTypes.number.isRequired,
    onMoveWrongDirection: PropTypes.func,
    calculationsTarget: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  moveToOffset() {
    super.moveToOffset();
    const { contentIndex } = this.props.current;
    setScrollTop(0);
    if (contentIndex === FOOTER_INDEX) {
      this.wrapper.current.scrollLeft = this.wrapper.current.scrollWidth;
    } else {
      this.wrapper.current.scrollLeft = 0;
    }
  }

  needRender(index) {
    const { current } = this.props;
    const calculated = Connector.calculations.isContentCalculated(index);
    const visible = current.contentIndex === index;
    return calculated && visible;
  }

  renderFooter() {
    const { footer, footerCalculations } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    const startOffset = Connector.calculations.getStartOffset(FOOTER_INDEX);

    return (
      <Footer
        key="footer"
        isCalculated={footerCalculations.isCalculated}
        content={footer}
        startOffset={startOffset}
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
    const isCalculated = Connector.calculations.isContentCalculated(content.index);

    return (
      <PageHtmlContent
        key={`${content.uri}:${content.index}`}
        content={content}
        isCalculated={isCalculated}
        startOffset={startOffset}
        localOffset={isCurrentContent ? current.offset - startOffset : INVALID_OFFSET}
        contentFooter={isLastContent ? contentFooter : null}
        StyledContent={StyledContent}
      />
    );
  }

  renderContents() {
    const { contents, calculationsTarget } = this.props;
    const StyledContent = getStyledContent(ContentFormat.HTML, ViewType.PAGE);
    return contents
      .filter(({ index }) => this.needRender(index) || calculationsTarget.includes(index))
      .map(content => this.renderContent(content, StyledContent));
  }
}

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  contentsCalculations: selectReaderContentsCalculations(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  footerCalculations: selectReaderFooterCalculations(state),
  bindingType: selectReaderBindingType(state),
  calculationsTargets: selectReaderCalculationsTargets(state),
});

const mapDispatchToProps = dispatch => ({
  ...readerBaseScreenMapDispatchToProps(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HtmlPageScreen);

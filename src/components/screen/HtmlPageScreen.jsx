import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderContentsCalculations,
  selectReaderFooterCalculations,
  selectReaderBindingType,
  selectReaderCalculationsTotal,
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
import { INVALID_OFFSET, READERJS_CONTENT_WRAPPER, ViewType } from '../../constants/SettingConstants';
import { getStyledContent, getStyledFooter } from '../styled';
import WithSelection from '../selection/WithSelection';

class HtmlPageScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
  }

  calculate(index, contentNode) {
    if (index === FOOTER_INDEX) {
      const hasFooter = Connector.calculations.getHasFooter();
      Connector.calculations.setContentTotal(FOOTER_INDEX, hasFooter ? 1 : 0);
    }
    waitThenRun(() => {
      const pagesTotal = Math.ceil(contentNode.scrollWidth
        / (Connector.setting.getContainerWidth() + Connector.setting.getColumnGap()));
      Connector.calculations.setContentTotal(index, pagesTotal);
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

  needRender(index) {
    const { current } = this.props;
    const calculated = Connector.calculations.isContentCalculated(index);
    const visible = current.contentIndex === index;
    return calculated && visible;
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    const startOffset = Connector.calculations.getStartOffset(FOOTER_INDEX);

    return (
      <Footer
        key="footer"
        content={footer}
        startOffset={startOffset}
        onContentRendered={this.calculate}
        containerVerticalMargin={containerVerticalMargin}
        StyledFooter={getStyledFooter(ContentFormat.HTML, ViewType.PAGE)}
      />
    );
  }

  renderContent(content, StyledContent) {
    const {
      current,
      contentFooter,
      annotationable,
      annotations,
      onSelectionChanged,
      onAnnotationTouched,
      selectable,
    } = this.props;
    const startOffset = Connector.calculations.getStartOffset(content.index);
    const isCurrentContent = current.contentIndex === content.index;
    const isLastContent = Connector.calculations.isLastContent(content.index);
    const isCalculated = Connector.calculations.isContentCalculated(content.index);

    return (
      <PageHtmlContent
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
      >
        {(annotationable || selectable) && (
          <WithSelection
            annotationable={annotationable}
            selectable={selectable}
            viewType={ViewType.PAGE}
            annotations={annotations}
            onSelectionChanged={onSelectionChanged}
            onAnnotationTouched={onAnnotationTouched}
            contentIndex={content.index}
          />
        )}
      </PageHtmlContent>
    );
  }

  renderContents() {
    const { contents } = this.props;
    const StyledContent = getStyledContent(ContentFormat.HTML, ViewType.PAGE);
    const calculatedTarget = Connector.calculations.getCalculationTargetContents();
    return contents
      .filter(({ index }) => this.needRender(index) || calculatedTarget.includes(index))
      .map(content => this.renderContent(content, StyledContent));
  }
}

HtmlPageScreen.defaultProps = {
  ...BaseScreen.defaultProps,
  footer: null,
  contentFooter: null,
  additionalContent: null,
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
  selectable: PropTypes.bool.isRequired,
  annotationable: PropTypes.bool.isRequired,
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

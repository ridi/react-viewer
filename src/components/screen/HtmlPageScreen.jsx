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
import Connector from '../../util/connector/';
import Footer from '../footer/Footer';
import PageTouchable, { Position } from './PageTouchable';
import { BindingType } from '../../constants/ContentConstants';
import { isExist } from '../../util/Util';
import PageHtmlContent from '../content/PageHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';

class HtmlPageScreen extends BaseScreen {
  calculate(index, nodeInfo) {
    const pagesTotal = Math.ceil(nodeInfo.scrollWidth
      / (Connector.setting.getContainerWidth() + Connector.setting.getColumnGap()));
    Connector.calculations.setTotal(index, pagesTotal);
  }

  onTouchableScreenTouched({ position }) {
    super.onTouchableScreenTouched({ position });

    const { bindingType, calculationsTotal, onMoveWrongDirection } = this.props;
    const { offset: currentOffset } = this.props.current;

    if (position === Position.MIDDLE) return;
    if (position === Position.RIGHT
      && bindingType === BindingType.RIGHT
      && currentOffset === 0) {
      if (isExist(onMoveWrongDirection)) {
        onMoveWrongDirection();
      }
      return;
    }

    let nextOffset = currentOffset;
    if (position === Position.LEFT) {
      nextOffset = bindingType === BindingType.LEFT ? currentOffset - 1 : currentOffset + 1;
    } else if (position === Position.RIGHT) {
      nextOffset = bindingType === BindingType.LEFT ? currentOffset + 1 : currentOffset - 1;
    }

    nextOffset = Math.max(0, Math.min(nextOffset, calculationsTotal - 1));
    if (currentOffset === nextOffset) return;

    Connector.current.updateCurrentPosition(nextOffset);
  }

  getTouchableScreen() {
    return PageTouchable;
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
    const hasFooter = Connector.calculations.getHasFooter();
    return (
      <Footer
        content={footer}
        startOffset={startOffset}
        onContentRendered={() => Connector.calculations.setTotal(FOOTER_INDEX, hasFooter ? 1 : 0)}
        containerVerticalMargin={containerVerticalMargin}
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
      <PageHtmlContent
        key={`${content.uri}:${content.index}`}
        content={content}
        startOffset={startOffset}
        isCalculated={Connector.calculations.isCalculated(content.index)}
        setting={setting}
        currentOffset={current.offset}
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

HtmlPageScreen.defaultProps = {
  ...BaseScreen.defaultProps,
  footer: null,
  contentFooter: null,
  onMoveWrongDirection: null,
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

import React from 'react';
import { connect } from 'react-redux';
import {
  selectContents,
  selectContentsCalculations,
  selectFooterCalculations,
  selectBindingType,
  selectCalculationsTotal,
} from '../../redux/selector';
import { screenWidth, setScrollTop } from '../../util/BrowserWrapper';
import {
  updateContent,
  updateContentError,
} from '../../redux/action';
import PropTypes, { FooterCalculationsType, ContentCalculationsType, ContentType } from '../prop-types';
import BaseScreen, { mapStateToProps as readerBaseScreenMapStateToProps } from './BaseScreen';
import Connector from '../../util/connector/';
import Footer from '../footer/Footer';
import PageTouchable, { Position } from './PageTouchable';
import { BindingType } from '../../constants/ContentConstants';
import { isExist } from '../../util/Util';
import PageHtmlContent from '../content/PageHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstant';

class HtmlPageScreen extends BaseScreen {
  calculate(index, nodeInfo) {
    const { columnGap } = this.props.setting;
    const pagesTotal = Math.ceil(nodeInfo.scrollWidth / (this.getWidth() + columnGap));
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

    nextOffset = Math.max(0, Math.min(nextOffset, calculationsTotal));
    if (currentOffset === nextOffset) return;

    Connector.calculations.updateCurrentPosition(nextOffset);
  }

  getWidth() {
    const { maxWidth } = this.props;
    const { columnsInPage, containerHorizontalMargin } = this.props.setting;
    if (columnsInPage > 1) {
      return screenWidth() - (containerHorizontalMargin * 2);
    }
    return Math.min(screenWidth() - (containerHorizontalMargin * 2), maxWidth);
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

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    const startOffset = Connector.calculations.getStartOffset(FOOTER_INDEX);
    return (
      <Footer
        content={footer}
        startOffset={startOffset}
        onContentRendered={() => Connector.calculations.setTotal(FOOTER_INDEX, 1)}
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

HtmlPageScreen.defaultProps = {
  ...BaseScreen.defaultProps,
  footer: null,
  contentFooter: null,
  onMoveWrongDirection: null,
};

HtmlPageScreen.propTypes = {
  ...BaseScreen.propTypes,
  contents: PropTypes.arrayOf(ContentType).isRequired,
  contentsCalculations: PropTypes.arrayOf(ContentCalculationsType).isRequired,
  actionUpdateContent: PropTypes.func.isRequired,
  actionUpdateContentError: PropTypes.func.isRequired,
  footer: PropTypes.node,
  contentFooter: PropTypes.node,
  footerCalculations: FooterCalculationsType.isRequired,
  bindingType: PropTypes.oneOf(BindingType.toList()).isRequired,
  calculationsTotal: PropTypes.number.isRequired,
  onMoveWrongDirection: PropTypes.func,
};

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  contents: selectContents(state),
  contentsCalculations: selectContentsCalculations(state),
  calculationsTotal: selectCalculationsTotal(state),
  footerCalculations: selectFooterCalculations(state),
  bindingType: selectBindingType(state),
});

const mapDispatchToProps = dispatch => ({
  actionUpdateContent: (index, content, isAllLoaded) => dispatch(updateContent(index, content, isAllLoaded)),
  actionUpdateContentError: (index, error, isAllLoaded) => dispatch(updateContentError(index, error, isAllLoaded)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HtmlPageScreen);

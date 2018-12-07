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
import HtmlContent from '../content/HtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import { ViewType } from '../../constants/SettingConstants';
import { getStyledContent, getStyledFooter } from '../styled';
import EventBus, { Events } from '../../event';

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

  constructor(props) {
    super(props);
    this.moveToOffset = this.moveToOffset.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    EventBus.on(Events.core.MOVE_TO_OFFSET, this.moveToOffset, this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    EventBus.offByTarget(this);
  }

  moveToOffset(offset) {
    waitThenRun(() => {
      const { contentIndex } = this.props.current;
      const w = this.wrapper;
      const cw = this.getContentRef(contentIndex);
      setScrollTop(0);
      if (contentIndex === FOOTER_INDEX) {
        w.current.scrollLeft = w.current.scrollWidth;
      } else {
        w.current.scrollLeft = 0;
      }
      const startOffset = Connector.calculations.getStartOffset(contentIndex);
      const localOffset = offset - startOffset;
      if (cw.current && localOffset >= 0) {
        cw.current.scrollLeft = localOffset
          * (Connector.setting.getContainerWidth() + Connector.setting.getColumnGap());
        EventBus.emit(Events.core.MOVED);
      }
    }, 0);
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
      contentFooter,
    } = this.props;
    const startOffset = Connector.calculations.getStartOffset(content.index);
    const isLastContent = Connector.calculations.isLastContent(content.index);
    const isCalculated = Connector.calculations.isContentCalculated(content.index);

    return (
      <HtmlContent
        key={`${content.uri}:${content.index}`}
        ref={this.getContentRef(content.index)}
        content={content}
        isCalculated={isCalculated}
        startOffset={startOffset}
        contentFooter={isLastContent ? contentFooter : null}
        StyledContent={StyledContent}
      />
    );
  }

  renderContents() {
    const { contents, calculationsTargets } = this.props;
    const StyledContent = getStyledContent(ContentFormat.HTML, ViewType.PAGE);
    return contents
      .filter(({ isInScreen, index }) => isInScreen || calculationsTargets.includes(index))
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

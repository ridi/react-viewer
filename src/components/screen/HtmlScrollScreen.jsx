import React from 'react';
import { connect } from 'react-redux';
import { fromEvent } from 'rxjs';
import {
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderFooterCalculations, selectReaderCalculationsTargets,
} from '../../redux/selector';
import Footer from '../footer/Footer';
import {
  scrollTop,
  setScrollTop,
  waitThenRun,
} from '../../util/BrowserWrapper';
import PropTypes, {
  FooterCalculationsType,
  ContentCalculationsType,
} from '../prop-types';
import BaseScreen, {
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
  mapStateToProps as readerBaseScreenMapStateToProps,
} from './BaseScreen';
import Connector from '../../service/connector';
import ScrollHtmlContent from '../content/ScrollHtmlContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import DOMEventConstants from '../../constants/DOMEventConstants';
import { INVALID_OFFSET, ViewType } from '../../constants/SettingConstants';
import { getStyledContent, getStyledFooter } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';
import EventBus, { Events } from '../../event';

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
    calculationsTargets: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.moveToOffset = this.moveToOffset.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    EventBus.on(Events.core.MOVE_TO_OFFSET, this.moveToOffset, this);
    EventBus.on(Events.calculation.READY_TO_READ, () => {
      this.scrollEventSubscription = fromEvent(window, DOMEventConstants.SCROLL)
        .subscribe(event => EventBus.emit(Events.core.SCROLL, event));
    }, this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    EventBus.offByTarget(this);
    if (this.scrollEventSubscription) {
      this.scrollEventSubscription.unsubscribe();
      this.scrollEventSubscription = null;
    }
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

  moveToOffset(offset) {
    super.moveToOffset();
    waitThenRun(() => {
      setScrollTop(offset);
      EventBus.emit(Events.core.MOVED);
    }, 0);
  }

  renderFooter() {
    const { footer, footerCalculations } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    return (
      <Footer
        key="footer"
        isCalculated={footerCalculations.isCalculated}
        content={footer}
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
    const { contents, calculationsTargets } = this.props;
    const StyledContent = getStyledContent(ContentFormat.HTML, ViewType.SCROLL);
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
  calculationsTargets: selectReaderCalculationsTargets(state),
});

const mapDispatchToProps = dispatch => ({
  ...readerBaseScreenMapDispatchToProps(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HtmlScrollScreen);

import React from 'react';
import { connect } from 'react-redux';
import { fromEvent, timer } from 'rxjs';
import { debounce, distinctUntilChanged, map } from 'rxjs/operators';
import {
  selectReaderContents,
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderFooterCalculations,
} from '../../redux/selector';
import {
  scrollLeft,
  scrollTop,
  setScrollTop,
  waitThenRun,
} from '../../util/BrowserWrapper';
import {
  addEventListener,
} from '../../util/EventHandler';
import PropTypes, { FooterCalculationsType, ContentCalculationsType, ContentType } from '../prop-types';
import BaseScreen, {
  mapStateToProps as readerBaseScreenMapStateToProps,
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
} from './BaseScreen';
import Footer from '../footer/Footer';
import Connector from '../../service/connector';
import ImageContent from '../content/ImageContent';
import { StyledImageScrollContent } from '../styled/StyledContent';
import DOMEventConstants from '../../constants/DOMEventConstants';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { ViewType } from '../../constants/SettingConstants';
import { getStyledFooter } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import EventBus, { Events } from '../../event';

class ImageScrollScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.scrollEventSubscription = fromEvent(window, DOMEventConstants.SCROLL).pipe(
      debounce(() => timer(DOMEventDelayConstants.SCROLL)),
      map(() => ({ scrollX: scrollLeft(), scrollY: scrollTop() })),
      distinctUntilChanged(),
    ).subscribe(data => EventBus.emit(Events.core.SCROLL, data));

    if (!this.listener) {
      const { current } = this.wrapper;
      this.listener = this.waitForResources()
        .then(() => {
          if (!current.isConnected) return;
          this.calculate(1, current);
        });
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.scrollEventSubscription) {
      this.scrollEventSubscription.unsubscribe();
      this.scrollEventSubscription = null;
    }
  }

  calculate(index, node) {
    if (index === FOOTER_INDEX) {
      Connector.calculations.setContentTotal(FOOTER_INDEX, node.scrollHeight);
    }
    const isLastContent = Connector.calculations.isLastContent(index);
    const { contentFooter } = this.props;
    waitThenRun(() => Connector.calculations.setContentTotal(
      index,
      node.scrollHeight + (isLastContent && contentFooter ? Connector.setting.getContentFooterHeight() : 0),
    ));
  }

  waitForResources() {
    // images
    const images = [...this.wrapper.current.querySelectorAll('img')]
      .filter(img => !img.complete)
      .map(img => new Promise((resolve) => {
        addEventListener(img, 'load', () => resolve());
        addEventListener(img, 'error', () => resolve());
      }));
    return Promise.all([...images]);
  }

  moveToOffset() {
    const { offset } = this.props.current;
    setScrollTop(offset);
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    return (
      <Footer
        content={footer}
        containerVerticalMargin={containerVerticalMargin}
        onContentRendered={this.calculate}
        StyledFooter={getStyledFooter(ContentFormat.IMAGE, ViewType.SCROLL)}
      />
    );
  }

  renderContent(content) {
    const {
      current,
      contentFooter,
    } = this.props;

    return (
      <ImageContent
        key={`${content.uri}:${content.index}`}
        content={content}
        currentOffset={current.offset}
        src={content.uri || content.content}
        onContentLoaded={this.onContentLoaded}
        onContentError={this.onContentError}
        contentFooter={Connector.calculations.isLastContent(content.index) ? contentFooter : null}
      />
    );
  }

  renderContents() {
    const { contents, setting } = this.props;

    return (
      <StyledImageScrollContent
        setting={setting}
        innerRef={this.wrapper}
        height="auto"
        visible
      >
        <div className="content_container">
          {contents.map(content => this.renderContent(content))}
        </div>
      </StyledImageScrollContent>
    );
  }
}

ImageScrollScreen.defaultProps = {
  ...BaseScreen.defaultProps,
  contentFooter: null,
};

ImageScrollScreen.propTypes = {
  ...BaseScreen.propTypes,
  contents: PropTypes.arrayOf(ContentType),
  contentsCalculations: PropTypes.arrayOf(ContentCalculationsType),
  calculationsTotal: PropTypes.number.isRequired,
  actionUpdateContent: PropTypes.func.isRequired,
  actionUpdateContentError: PropTypes.func.isRequired,
  footerCalculations: FooterCalculationsType.isRequired,
  contentFooter: PropTypes.node,
  ignoreScroll: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  contents: selectReaderContents(state),
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
)(ImageScrollScreen);

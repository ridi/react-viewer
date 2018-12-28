import React from 'react';
import { connect } from 'react-redux';
import { fromEvent } from 'rxjs';
import {
  selectReaderContents,
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderFooterCalculations,
} from '../../redux/selector';
import {
  setScrollTop, waitThenRun,
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
import { ViewType } from '../../constants/SettingConstants';
import { getStyledFooter } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';
import EventBus, { Events } from '../../event';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';

class ImageScrollScreen extends BaseScreen {
  componentDidMount() {
    super.componentDidMount();
    this.scrollEventSubscription = fromEvent(window, DOMEventConstants.SCROLL)
      .subscribe(event => EventBus.emit(Events.SCROLL, event));
    EventBus.on(Events.MOVE_TO_OFFSET, this.moveToOffset.bind(this), this);

    if (!this.listener) {
      const { contentFooter } = this.props;
      const { current } = this.wrapper;
      this.listener = this.waitForResources()
        .then(() => {
          if (!current.isConnected) return;
          EventBus.emit(Events.CALCULATE_CONTENT, { index: 1, contentNode: current, contentFooterNode: contentFooter });
        });
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    EventBus.offByTarget(this);
    if (this.scrollEventSubscription) {
      this.scrollEventSubscription.unsubscribe();
      this.scrollEventSubscription = null;
    }
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

  moveToOffset(offset) {
    waitThenRun(() => {
      setScrollTop(offset);
      EventBus.emit(Events.MOVED);
    }, 0);
  }

  renderFooter() {
    const { footer, footerCalculations } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    return (
      <Footer
        isCalculated={footerCalculations.total !== PRE_CALCULATION}
        content={footer}
        containerVerticalMargin={containerVerticalMargin}
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

import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderContents,
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderFooterCalculations,
} from '../../redux/selector';
import {
  scrollTop,
  setScrollTop,
  addEventListener,
  removeEventListener,
} from '../../util/BrowserWrapper';
import { onScreenScrolled } from '../../redux/action';
import PropTypes, { FooterCalculationsType, ContentCalculationsType, ContentType } from '../prop-types';
import BaseScreen, {
  mapStateToProps as readerBaseScreenMapStateToProps,
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
} from './BaseScreen';
import { debounce } from '../../util/Util';
import Footer from '../footer/Footer';
import Connector from '../../util/connector';
import ImageContent from '../content/ImageContent';
import { StyledImageScrollContent } from '../styled/StyledContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import DOMEventConstants from '../../constants/DOMEventConstants';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';
import { READERJS_CONTENT_WRAPPER, ViewType } from '../../constants/SettingConstants';
import { getStyledFooter } from '../styled';
import { ContentFormat } from '../../constants/ContentConstants';

class ImageScrollScreen extends BaseScreen {
  componentDidMount() {
    super.componentDidMount();

    this.onScroll = debounce(e => this.onScrollHandle(e), DOMEventDelayConstants.SCROLL);
    addEventListener(window, DOMEventConstants.SCROLL, this.onScroll, { passive: true });
    this.onContentRendered = this.onContentRendered.bind(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    removeEventListener(window, DOMEventConstants.SCROLL, this.onScroll, { passive: true });
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    Connector.calculations.setTotal(1, this.wrapper.current.scrollHeight);
  }

  onScrollHandle(e) {
    e.preventDefault();
    e.stopPropagation();

    const { ignoreScroll, actionOnScreenScrolled } = this.props;
    if (ignoreScroll) {
      return;
    }
    actionOnScreenScrolled();
    Connector.current.updateCurrentPosition(scrollTop());
  }

  moveToOffset() {
    const { offset } = this.props.current;
    setScrollTop(offset);
  }

  onContentRendered(footerNode) {
    Connector.calculations.setTotal(FOOTER_INDEX, footerNode.scrollHeight);
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    const startOffset = Connector.calculations.getStartOffset(FOOTER_INDEX);
    return (
      <Footer
        content={footer}
        startOffset={startOffset}
        containerVerticalMargin={containerVerticalMargin}
        onContentRendered={this.onContentRendered}
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
        className={READERJS_CONTENT_WRAPPER}
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
  actionOnScreenScrolled: PropTypes.func.isRequired,
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
  actionOnScreenScrolled: () => dispatch(onScreenScrolled()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageScrollScreen);

import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderContents,
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderFooterCalculations,
} from '../../redux/selector';
import { screenWidth, scrollTop, setScrollTop } from '../../util/BrowserWrapper';
import { onScreenScrolled } from '../../redux/action';
import PropTypes, { FooterCalculationsType, ContentCalculationsType, ContentType } from '../prop-types';
import BaseScreen, {
  mapStateToProps as readerBaseScreenMapStateToProps,
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
} from './BaseScreen';
import { debounce } from '../../util/Util';
import ScrollTouchable from './ScrollTouchable';
import Footer from '../footer/Footer';
import Connector from '../../util/connector/';
import ImageContent from '../content/ImageContent';
import ContentFooter from '../footer/ContentFooter';
import { StyledImageScrollContent } from '../styled/StyledContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import DOMEventConstants from '../../constants/DOMEventConstants';
import DOMEventDelayConstants from '../../constants/DOMEventDelayConstants';

class ImageScrollScreen extends BaseScreen {
  componentDidMount() {
    super.componentDidMount();

    this.onScroll = debounce(e => this.onScrollHandle(e), DOMEventDelayConstants.SCROLL);
    window.addEventListener(DOMEventConstants.SCROLL, this.onScroll);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener(DOMEventConstants.SCROLL, this.onScroll);
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

  getTouchableScreen() {
    return ScrollTouchable;
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
        onContentRendered={footerNode => Connector.calculations.setTotal(FOOTER_INDEX, footerNode.scrollHeight)}
      />
    );
  }

  renderContent(content, contentWidth) {
    const {
      current,
      contentFooter,
    } = this.props;

    const { contentFooterHeight } = this.props.setting;

    return (
      <ImageContent
        key={`${content.uri}:${content.index}`}
        content={content}
        currentOffset={current.offset}
        src={content.uri}
        width={contentWidth}
        onContentLoaded={(index, c) => this.onContentLoaded(index, c)}
        onContentError={(index, error) => this.onContentError(index, error)}
        contentFooter={Connector.calculations.isLastContent(content.index) ?
          <ContentFooter content={contentFooter} height={contentFooterHeight} /> : null}
      />
    );
  }

  renderContents() {
    const { contents, setting, maxWidth } = this.props;
    const { containerHorizontalMargin } = this.props.setting;
    const contentWidth = Math.min(screenWidth() - (containerHorizontalMargin * 2), maxWidth);

    return (
      <StyledImageScrollContent
        setting={setting}
        innerRef={this.wrapper}
        width={`${contentWidth}px`}
        containerVerticalMargin={setting.containerVerticalMargin}
        containerHorizontalMargin={setting.containerHorizontalMargin}
        height="auto"
        visible
      >
        <div className="content_container">
          {contents.map(content => this.renderContent(content, contentWidth))}
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

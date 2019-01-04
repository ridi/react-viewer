import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';
import Connector from '../../service/connector';
import { addEventListener } from '../../util/EventHandler';
import BaseContent from './BaseContent';
import EventBus, { Events } from '../../event';
import ReaderJsHelper from '../../service/readerjs/ReaderJsHelper';

class HtmlContent extends BaseContent {
  contentRef = React.createRef();
  listener = null;

  componentDidMount() {
    super.componentDidMount();
    const { isCalculated } = this.props;
    if (!isCalculated) {
      this.afterContentLoaded();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isCalculated,
    } = this.props;
    if (!isCalculated) {
      this.afterContentLoaded();
    }

    if (prevProps.isCalculated && !isCalculated) {
      this.listener = null;
    }
  }

  afterContentLoaded() {
    const { contentFooter, forwardedRef } = this.props;
    const { index } = this.props.content;
    if (!this.listener) {
      const { current: wrapperRef } = forwardedRef;
      const { current: contentRef } = this.contentRef;
      this.listener = this.waitForResources()
        .then(() => {
          if (!wrapperRef.isConnected) return;
          EventBus.emit(Events.CALCULATE_CONTENT, { index, contentNode: wrapperRef, contentFooterNode: contentFooter });
          EventBus.emit(Events.UPDATE_CONTENT, { index, content: contentRef.innerHTML });
        });
    }
  }

  waitForResources() {
    // images
    const { index } = this.props.content;
    const images = [...this.contentRef.current.querySelectorAll('img')]
      .filter(img => !img.complete)
      .map(img => new Promise((resolve) => {
        addEventListener(img, 'load', () => resolve());
        addEventListener(img, 'error', () => resolve());
      }));
    // fonts
    const fonts = [];
    if (document.fonts && document.fonts.ready) {
      fonts.push(document.fonts.ready);
    }
    return Promise.all([...images, ...fonts])
      .then(() => new Promise(resolve => ReaderJsHelper.get(index).content.reviseImages(resolve)));
  }

  renderContent() {
    const { content } = this.props.content;
    const { contentFooter, children } = this.props;

    return (
      <>
        <section
          ref={this.contentRef}
          className="content_container"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {contentFooter}
        {children}
      </>
    );
  }

  render() {
    const { index } = this.props.content;
    const { startOffset, StyledContent, forwardedRef } = this.props;
    return (
      <StyledContent
        id={`${Connector.setting.getChapterId(index)}`}
        index={index}
        className="chapter"
        visible={startOffset !== PRE_CALCULATION}
        startOffset={startOffset}
        innerRef={forwardedRef}
      >
        {this.renderContent()}
      </StyledContent>
    );
  }
}

HtmlContent.defaultProps = {
  contentFooter: null,
  StyledContent: () => {},
  children: null,
  forwardedRef: React.createRef(),
};

HtmlContent.propTypes = {
  content: ContentType,
  startOffset: PropTypes.number.isRequired,
  contentFooter: PropTypes.node,
  isCalculated: PropTypes.bool.isRequired,
  StyledContent: PropTypes.func,
  children: PropTypes.node,
  forwardedRef: PropTypes.object,
};

export default React.forwardRef((props, ref) => <HtmlContent forwardedRef={ref} {...props} />);

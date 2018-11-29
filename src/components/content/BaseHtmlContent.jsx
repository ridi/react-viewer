import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';
import Connector from '../../service/connector';
import { addEventListener } from '../../util/EventHandler';
import BaseContent from './BaseContent';
import EventBus, { Events } from '../../event';

export default class BaseHtmlContent extends BaseContent {
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
    this.contentWrapperRef = React.createRef();
    this.listener = null;
  }

  componentDidMount() {
    super.componentDidMount();
    const { isCalculated } = this.props;
    if (!isCalculated) {
      this.afterContentLoaded();
    }

    this.moveToOffset();
  }

  componentDidUpdate(prevProps) {
    const {
      localOffset,
      isCalculated,
    } = this.props;
    if (!isCalculated) {
      this.afterContentLoaded();
    }

    if (prevProps.isCalculated && !isCalculated) {
      this.listener = null;
    }
    if ((!prevProps.isCalculated && isCalculated)
      || (localOffset !== prevProps.localOffset)) {
      this.moveToOffset();
    }
  }

  afterContentLoaded() {
    const { contentFooter } = this.props;
    const { index } = this.props.content;
    if (!this.listener) {
      const { current } = this.contentWrapperRef;
      this.listener = this.waitForResources()
        .then(() => {
          if (!current.isConnected) return;
          EventBus.emit(Events.calculation.CALCULATE_CONTENT, { index, contentNode: current, contentFooterNode: contentFooter });
        });
    }
  }

  waitForResources() {
    // images
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
    return Promise.all([...images, ...fonts]);
  }

  moveToOffset() {}

  renderContent(contentPrefix = '') {
    const { isContentLoaded, content } = this.props.content;
    const { contentFooter, className, children } = this.props;
    if (isContentLoaded) {
      return (
        <>
          <section
            ref={this.contentRef}
            className={`content_container ${className}`}
            dangerouslySetInnerHTML={{ __html: `${contentPrefix} ${content}` }}
          />
          {contentFooter}
          {children}
        </>
      );
    }
    return null;
  }

  render() {
    const { index } = this.props.content;
    const { startOffset, StyledContent } = this.props;
    const prefix = `<pre id="${Connector.setting.getChapterIndicatorId(index)}"></pre>`;
    return (
      <StyledContent
        id={`${Connector.setting.getChapterId(index)}`}
        index={index}
        className="chapter"
        visible={startOffset !== PRE_CALCULATION}
        startOffset={startOffset}
        innerRef={this.contentWrapperRef}
      >
        {this.renderContent(prefix)}
      </StyledContent>
    );
  }
}

BaseHtmlContent.defaultProps = {
  contentFooter: null,
  className: '',
  StyledContent: () => {},
  children: null,
};

BaseHtmlContent.propTypes = {
  content: ContentType,
  className: PropTypes.string,
  startOffset: PropTypes.number.isRequired,
  localOffset: PropTypes.number.isRequired,
  contentFooter: PropTypes.node,
  isCalculated: PropTypes.bool.isRequired,
  StyledContent: PropTypes.func,
  children: PropTypes.node,
};

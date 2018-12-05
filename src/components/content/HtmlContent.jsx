import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';
import Connector from '../../service/connector';
import { addEventListener } from '../../util/EventHandler';
import BaseContent from './BaseContent';
import EventBus, { Events } from '../../event';

class HtmlContent extends BaseContent {
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
    this.listener = null;
  }

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
      const { current } = forwardedRef;
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

  renderContent(contentPrefix = '') {
    const { content } = this.props.content;
    const { contentFooter, className, children } = this.props;
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

  render() {
    const { index } = this.props.content;
    const { startOffset, StyledContent, forwardedRef } = this.props;
    const prefix = `<pre id="${Connector.setting.getChapterIndicatorId(index)}"></pre>`;
    return (
      <StyledContent
        id={`${Connector.setting.getChapterId(index)}`}
        index={index}
        className="chapter"
        visible={startOffset !== PRE_CALCULATION}
        startOffset={startOffset}
        innerRef={forwardedRef}
      >
        {this.renderContent(prefix)}
      </StyledContent>
    );
  }
}

HtmlContent.defaultProps = {
  contentFooter: null,
  className: '',
  StyledContent: () => {},
  children: null,
  forwardedRef: React.createRef(),
};

HtmlContent.propTypes = {
  content: ContentType,
  className: PropTypes.string,
  startOffset: PropTypes.number.isRequired,
  contentFooter: PropTypes.node,
  isCalculated: PropTypes.bool.isRequired,
  StyledContent: PropTypes.func,
  children: PropTypes.node,
  forwardedRef: PropTypes.object,
};

export default React.forwardRef((props, ref) => <HtmlContent forwardedRef={ref} {...props} />);

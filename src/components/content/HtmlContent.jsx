import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';
import Connector from '../../service/connector';
import BaseContent from './BaseContent';
import EventBus, { Events } from '../../event';
import ReaderJsHelper from '../../service/readerjs/ReaderJsHelper';
import { waitContentResources } from '../../util/BrowserWrapper';

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
      this.listener = waitContentResources(contentRef)
        .then(() => new Promise((resolve) => {
          try {
            ReaderJsHelper.get(index).content.reviseImages(resolve);
          } catch (e) {
            /* ignore */
            resolve();
          }
        }))
        .then(() => {
          if (!wrapperRef.isConnected) return;
          EventBus.emit(Events.CALCULATE_CONTENT, { index, contentNode: wrapperRef, contentFooterNode: contentFooter });
          EventBus.emit(Events.UPDATE_CONTENT, { index, content: contentRef.innerHTML });
        })
        .catch(() => { /* ignore */ });
    }
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

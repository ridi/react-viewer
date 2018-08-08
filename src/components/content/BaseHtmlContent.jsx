import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';
import Connector from '../../util/connector/';

export default class BaseHtmlContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.wrapper = React.createRef();
    this.content = React.createRef();
    this.listener = null;
  }

  componentDidMount() {
    const { isContentLoaded } = this.props.content;
    if (!isContentLoaded) {
      this.fetch();
    }
    this.moveToOffset();
  }

  componentDidUpdate(prevProps) {
    const {
      onContentRendered,
      localOffset,
      isCalculated,
      contentFooter,
    } = this.props;
    const { index, isContentLoaded } = this.props.content;
    const contentFooterHeight = contentFooter ? Connector.setting.getContentFooterHeight() : 0;
    if (!isContentLoaded) return;
    if (!this.listener) {
      const { current } = this.content;
      this.listener = this.waitForResources()
        .then(() => onContentRendered(index, {
          scrollWidth: current.scrollWidth,
          scrollHeight: current.scrollHeight + contentFooterHeight,
        }));
    }
    if (prevProps.isCalculated && !isCalculated) {
      this.listener = null;
    }
    if ((!prevProps.isCalculated && isCalculated)
      || (localOffset !== prevProps.localOffset)) {
      this.moveToOffset();
    }
  }

  fetch() {
    const { uri, index } = this.props.content;
    const { onContentLoaded, onContentError } = this.props;
    fetch(uri).then(response => response.json())
      .then(data => onContentLoaded(index, data.value))
      .catch(error => onContentError(index, error));
  }

  waitForResources() {
    // images
    const images = [...this.content.current.querySelectorAll('img')]
      .filter(img => !img.complete)
      .map(img => new Promise((resolve) => {
        img.addEventListener('load', () => resolve());
        img.addEventListener('error', () => resolve());
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
    const { isContentLoaded, isContentOnError, content } = this.props.content;
    const { contentFooter, className } = this.props;
    if (isContentLoaded) {
      return (
        <React.Fragment>
          <section
            ref={this.content}
            className={`content_container ${className}`}
            dangerouslySetInnerHTML={{ __html: `${contentPrefix} ${content}` }}
          />
          {contentFooter}
        </React.Fragment>
      );
    } else if (isContentOnError) {
      return <div>Error</div>; // TODO 에러 화면으로 변경
    }
    return <div>Loading...</div>; // TODO 로딩 화면으로 변경
  }

  render() {
    const { index } = this.props.content;
    const { startOffset } = this.props;
    const StyledContent = Connector.setting.getStyledContent();
    const prefix = `<pre id="${Connector.setting.getChapterIndicatorId(index)}"></pre>`;
    return (
      <StyledContent
        id={`${Connector.setting.getChapterId(index)}`}
        index={index}
        className="chapter"
        visible={startOffset !== PRE_CALCULATION}
        startOffset={startOffset}
        innerRef={this.wrapper}
      >
        {this.renderContent(prefix)}
      </StyledContent>
    );
  }
}

BaseHtmlContent.defaultProps = {
  contentFooter: null,
  className: '',
};

BaseHtmlContent.propTypes = {
  content: ContentType,
  className: PropTypes.string,
  startOffset: PropTypes.number.isRequired,
  localOffset: PropTypes.number.isRequired,
  onContentLoaded: PropTypes.func,
  onContentError: PropTypes.func,
  onContentRendered: PropTypes.func,
  contentFooter: PropTypes.node,
  isCalculated: PropTypes.bool.isRequired,
};

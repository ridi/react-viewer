import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';
import Connector from '../../util/connector';
import { addEventListener } from '../../util/BrowserWrapper';

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
      this.loadContent();
      return;
    }

    this.afterContentLoaded();
  }

  componentDidUpdate(prevProps) {
    const {
      localOffset,
      isCalculated,
    } = this.props;
    const { isContentLoaded } = this.props.content;
    if (!isContentLoaded) return;

    this.afterContentLoaded();

    if (prevProps.isCalculated && !isCalculated) {
      this.listener = null;
    }
    if ((!prevProps.isCalculated && isCalculated)
      || (localOffset !== prevProps.localOffset)) {
      this.moveToOffset();
    }
  }

  loadContent() {
    const { uri, index } = this.props.content;
    const { onContentLoaded, onContentError } = this.props;

    if (!uri) onContentError(index, 'no uri');
    fetch(uri).then(response => response.json())
      .then(data => onContentLoaded(index, data.value))
      .catch(error => onContentError(index, error));
  }

  afterContentLoaded() {
    const { onContentRendered } = this.props;
    const { index } = this.props.content;
    if (!this.listener) {
      const { current } = this.content;
      this.listener = this.waitForResources()
        .then(() => {
          if (!current.isConnected) return;
          onContentRendered(index, current);
        });
    }
  }

  waitForResources() {
    // images
    const images = [...this.content.current.querySelectorAll('img')]
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
    const { isContentLoaded, isContentOnError, content } = this.props.content;
    const { contentFooter, className, isCalculated } = this.props;
    if (isContentLoaded) {
      return (
        <React.Fragment>
          {!isCalculated && <div style={{ position: 'relative', textAlign: 'center' }}>Loading...</div>}
          <section
            ref={this.content}
            className={`content_container ${className}`}
            dangerouslySetInnerHTML={{ __html: `${contentPrefix} ${content}` }}
          />
          {contentFooter}
        </React.Fragment>
      );
    }
    if (isContentOnError) {
      return <div style={{ position: 'relative', textAlign: 'center' }}>Error</div>; // TODO 에러 화면으로 변경
    }
    return <div style={{ position: 'relative', textAlign: 'center' }}>Loading...</div>; // TODO 로딩 화면으로 변경
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
  StyledContent: () => {},
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
  StyledContent: PropTypes.func,
};

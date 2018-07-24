import React from 'react';
import PropTypes, { ContentType, SettingType } from '../prop-types';
import ContentFooter from '../footer/ContentFooter';
import { PRE_CALCULATION } from '../../constants/CalculationsConstant';
import Connector from '../../util/connector/';

export default class BaseHtmlContent extends React.Component {
  constructor(props) {
    super(props);

    this.wrapper = React.createRef();
    this.content = React.createRef();
  }

  componentDidMount() {
    const { isContentLoaded } = this.props.content;
    if (!isContentLoaded) {
      this.fetch();
    }
    this.moveToOffset(this.getLocalOffset());
  }

  componentDidUpdate(prevProps) {
    const { onContentRendered, currentOffset, isCalculated } = this.props;
    const { index, isContentLoaded } = this.props.content;
    if (isContentLoaded) {
      if (!isCalculated) {
        const { current } = this.wrapper;
        this.waitForResources().then(() => onContentRendered(index, {
          scrollWidth: current.scrollWidth,
          scrollHeight: current.scrollHeight,
        }));
      }
    }
    if (currentOffset !== prevProps.currentOffset) {
      this.moveToOffset(this.getLocalOffset());
    }
  }

  getLocalOffset() {
    const { currentOffset, startOffset } = this.props;
    return currentOffset - startOffset;
  }

  getHeight() {
    return 'auto';
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
    const { contentFooter, setting } = this.props;
    if (isContentLoaded) {
      return (
        <React.Fragment>
          <section ref={this.content} className="content_container" dangerouslySetInnerHTML={{ __html: `${contentPrefix} ${content}` }} />
          {contentFooter ? <ContentFooter content={contentFooter} height={setting.contentFooterHeight} /> : null}
        </React.Fragment>
      );
    } else if (isContentOnError) {
      return <div>Error</div>; // TODO 에러 화면으로 변경
    }
    return <div>Loading...</div>; // TODO 로딩 화면으로 변경
  }

  render() {
    const { index } = this.props.content;
    const {
      width,
      startOffset,
      setting,
      containerVerticalMargin,
      containerHorizontalMargin,
    } = this.props;
    const StyledContent = Connector.setting.getStyledContent();
    const prefix = `<pre id="${Connector.setting.getChapterIndicatorId(index)}"></pre>`;
    return (
      <StyledContent
        id={`${Connector.setting.getChapterId(index)}`}
        className="chapter"
        setting={setting}
        width={`${width}px`}
        height={this.getHeight()}
        containerVerticalMargin={containerVerticalMargin}
        containerHorizontalMargin={containerHorizontalMargin}
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
};

BaseHtmlContent.propTypes = {
  content: ContentType,
  startOffset: PropTypes.number.isRequired,
  currentOffset: PropTypes.number.isRequired,
  onContentLoaded: PropTypes.func,
  onContentError: PropTypes.func,
  onContentRendered: PropTypes.func,
  setting: SettingType.isRequired,
  containerHorizontalMargin: PropTypes.number.isRequired,
  containerVerticalMargin: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  contentFooter: PropTypes.node,
  isCalculated: PropTypes.bool.isRequired,
};

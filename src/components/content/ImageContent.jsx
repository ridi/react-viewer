import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import BaseContent from './BaseContent';
import { PRE_CALCULATED_RATIO } from '../../constants/ContentConstants';
import EventBus, { Events } from '../../event';

class ImageContent extends BaseContent {
  imageRef = React.createRef();

  constructor(props) {
    super(props);

    this.imageOnErrorHandler = this.imageOnErrorHandler.bind(this);
    this.imageOnLoadHandler = this.imageOnLoadHandler.bind(this);
  }

  componentDidMount() {
    const { isCalculated, contentFooter, content } = this.props;
    if (!isCalculated) {
      EventBus.emit(Events.CALCULATE_CONTENT, {
        index: content.index,
        contentNode: this.imageRef.current,
        contentFooterNode: contentFooter,
        ratio: content.ratio,
      });
    }
  }

  componentDidUpdate() {
    const { isCalculated, contentFooter, content } = this.props;
    if (!isCalculated) {
      EventBus.emit(Events.CALCULATE_CONTENT, {
        index: content.index,
        contentNode: this.imageRef.current,
        contentFooterNode: contentFooter,
        ratio: content.ratio,
      });
    }
  }

  imageOnErrorHandler() {
    const { index, isContentOnError } = this.props.content;
    if (!isContentOnError) {
      EventBus.emit(Events.CONTENT_ERROR, { index, error: '' });
    }
  }

  imageOnLoadHandler() {
    const { index, isContentLoaded } = this.props.content;
    if (!isContentLoaded) {
      let ratio = PRE_CALCULATED_RATIO;
      if (this.imageRef.current) {
        const { naturalWidth: w, naturalHeight: h } = this.imageRef.current;
        ratio = h / w;
      }
      EventBus.emit(Events.CONTENT_LOADED, { index, content: '', ratio });
    }
  }

  renderImage() {
    const { src } = this.props;
    const { isContentOnError } = this.props.content;
    if (isContentOnError) {
      return (
        <div className="error_image_wrapper">
          <span className="error_image svg_picture_1" />
        </div>
      );
    }
    return (
      <img
        ref={this.imageRef}
        src={src}
        alt=""
        onLoad={this.imageOnLoadHandler}
        onError={this.imageOnErrorHandler}
      />
    );
  }

  render() {
    const { contentFooter } = this.props;
    const { isContentLoaded } = this.props.content;
    return (
      <section
        ref={this.props.forwardedRef}
        className={`comic_page ${isContentLoaded ? 'loaded' : ''} ${contentFooter ? 'has_content_footer' : ''}`}
      >
        {this.renderImage()}
        {contentFooter}
      </section>
    );
  }
}

ImageContent.defaultProps = {
  contentFooter: null,
  forwardedRef: React.createRef(),
};

ImageContent.propTypes = {
  src: PropTypes.string,
  content: ContentType.isRequired,
  contentFooter: PropTypes.node,
  forwardedRef: PropTypes.any,
  isCalculated: PropTypes.bool,
};

export default React.forwardRef((props, ref) => <ImageContent forwardedRef={ref} {...props} />);

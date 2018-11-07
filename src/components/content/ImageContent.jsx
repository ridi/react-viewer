import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import BaseContent from './BaseContent';

class ImageContent extends BaseContent {
  imageOnErrorHandler() {
    const { onContentError } = this.props;
    const { index, isContentOnError } = this.props.content;
    if (!isContentOnError) {
      onContentError(index, '');
    }
  }

  imageOnLoadHandler() {
    const { onContentLoaded } = this.props;
    const { index, isContentLoaded } = this.props.content;
    if (!isContentLoaded) {
      onContentLoaded(index, '');
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
        src={src}
        alt=""
        onLoad={() => this.imageOnLoadHandler()}
        onError={() => this.imageOnErrorHandler()}
      />
    );
  }

  render() {
    const { contentFooter, additionalContent } = this.props;
    const { isContentLoaded } = this.props.content;
    return (
      <section
        ref={this.props.forwardedRef}
        className={`comic_page ${isContentLoaded ? 'loaded' : ''} ${contentFooter ? 'has_content_footer' : ''}`}
      >
        {this.renderImage()}
        {contentFooter}
        {additionalContent}
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
  onContentLoaded: PropTypes.func,
  onContentError: PropTypes.func,
  contentFooter: PropTypes.node,
  forwardedRef: PropTypes.any,
};

export default React.forwardRef((props, ref) => <ImageContent forwardedRef={ref} {...props} />);

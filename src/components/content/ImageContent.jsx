import React from 'react';
import PropTypes, { ContentType } from '../prop-types';

export default class ImageContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }

  imageOnErrorHandler() {
    const { onContentError } = this.props;
    const { index } = this.props.content;
    onContentError(index, '');
  }

  imageOnLoadHandler() {
    const { onContentLoaded } = this.props;
    const { index } = this.props.content;
    onContentLoaded(index, '');
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
    const { contentFooter } = this.props;
    const { isContentLoaded } = this.props.content;
    return (
      <section
        ref={this.wrapper}
        className={`comic_page lazy_load ${isContentLoaded ? 'loaded' : ''} ${contentFooter ? 'has_content_footer' : ''}`}
      >
        {this.renderImage()}
        {contentFooter}
      </section>
    );
  }
}

ImageContent.defaultProps = {
  contentFooter: null,
};

ImageContent.propTypes = {
  src: PropTypes.string.isRequired,
  content: ContentType.isRequired,
  onContentLoaded: PropTypes.func,
  onContentError: PropTypes.func,
  contentFooter: PropTypes.node,
};

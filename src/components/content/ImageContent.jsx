import React from 'react';
import PropTypes, { ContentType } from '../prop-types';

export default class ImageContent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      inView: false,
    };
    this.observer = null;
  }

  componentDidMount() {
    // this.startObserve();
  }

  componentWillUnmount() {
    if (this.observer) {
      if (this.wrapper.current) this.observer.observe(this.wrapper.current);
      this.observer = null;
    }
  }

  componentDidUpdate() {
    const { onContentRendered } = this.props;
    const { index, isContentLoaded } = this.props.content;
    if (isContentLoaded) {
       // onContentRendered(index, this.wrapper.current);
    }
  }

  startObserve() {
    if (!this.wrapper.current) {
      return;
    }
    if (typeof window.IntersectionObserver !== 'function') {
      this.setState({ inView: true });
      return;
    }

    this.observer = new IntersectionObserver((entries, observer) => {
      if (entries.some(({ isIntersecting, intersectionRatio }) => isIntersecting || intersectionRatio > 0)) {
        this.setState({ inView: true });
        observer.unobserve(this.wrapper.current);
      }
    }, {
      threshold: 0,
      rootMargin: '500%',
    });
    this.observer.observe(this.wrapper.current);
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
    // onContentRendered(index, this.wrapper.current);
  }

  renderImage() {
    const { src } = this.props;
    const { isContentOnError } = this.props.content;
    // const { inView } = this.state;
    // if (!inView) return null;
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
  width: PropTypes.number.isRequired,
  content: ContentType.isRequired,
  onContentLoaded: PropTypes.func,
  onContentError: PropTypes.func,
  contentFooter: PropTypes.node,
};

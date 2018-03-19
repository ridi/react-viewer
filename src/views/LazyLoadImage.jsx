import React from 'react';
import PropTypes from 'prop-types';

export default class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      inView: false,
      error: false,
    };
    this.observer = null;
  }

  componentDidMount() {
    this.startObserve();
  }

  componentWillUnmount() {
    if (this.observer) {
      if (this.node) this.observer.observe(this.node);
      this.observer = null;
    }
  }

  startObserve() {
    if (!this.node) {
      return;
    }
    if (typeof window.IntersectionObserver !== 'function') {
      this.setState({ inView: true });
      return;
    }

    this.observer = new IntersectionObserver((entries, observer) => {
      if (entries.some(({ isIntersecting, intersectionRatio }) => isIntersecting || intersectionRatio > 0)) {
        this.setState({ inView: true });
        observer.unobserve(this.node);
      }
    }, {
      threshold: 0,
      rootMargin: '250%', // load 2 pages in advance
    });
    this.observer.observe(this.node);
  }

  imageOnLoadHandler() {
    this.setState({ loaded: true });
  }

  imageOnErrorHandler() {
    this.setState({ loaded: true, error: true });
  }

  renderImage() {
    const { src } = this.props;
    const { inView, error } = this.state;
    if (!inView) {
      return null;
    }
    if (error) {
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
    const { loaded } = this.state;
    const { className = '' } = this.props;
    return (
      <div
        className={`comic_page lazy_load ${loaded ? 'loaded' : ''} ${className}`}
        ref={(node) => { this.node = node; }}
      >
        {this.renderImage()}
      </div>
    );
  }
}

LazyLoadImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

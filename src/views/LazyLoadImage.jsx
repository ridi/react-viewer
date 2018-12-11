import React from 'react';
import PropTypes from 'prop-types';

export default class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      inView: false,
      error: false,
      hash: '',
    };
    this.observer = null;
    this.reloadImage = this.reloadImage.bind(this);
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

    const { lazyLoadMargin } = this.props;
    this.observer = new IntersectionObserver((entries, observer) => {
      if (entries.some(({ isIntersecting, intersectionRatio }) => isIntersecting || intersectionRatio > 0)) {
        this.setState({ inView: true });
        observer.unobserve(this.node);
      }
    }, {
      threshold: 0,
      rootMargin: `${lazyLoadMargin}%`,
    });
    this.observer.observe(this.node);
  }

  imageOnLoadHandler() {
    this.setState({ loaded: true });
  }

  imageOnErrorHandler() {
    this.setState({ loaded: true, error: true });
  }

  reloadImage() {
    this.setState({
      loaded: false,
      error: false,
      hash: `#${Date.now()}`,
      inView: true,
    });
  }

  renderImage() {
    const { src } = this.props;
    const { inView, error, hash } = this.state;
    if (!inView) {
      return null;
    }
    if (error) {
      return (
        <button className="error_image_wrapper" onClick={this.reloadImage}>
          <span className="error_image svg_reload_1" />
        </button>
      );
    }
    return (
      <img
        src={`${src}${hash}`}
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
  lazyLoadMargin: PropTypes.number.isRequired,
};

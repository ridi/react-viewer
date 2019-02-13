import React from 'react';
import PropTypes, { ContentType } from '../prop-types';
import BaseContent from './BaseContent';
import { PRE_CALCULATED_RATIO } from '../../constants/ContentConstants';
import EventBus, { Events } from '../../event';
import { ViewType } from '../../constants/SettingConstants';
import Connector from '../../service/connector';

export default class ImageContent extends BaseContent {
  imageRef = React.createRef();
  wrapperRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      imageInScreen: false,
    };

    this.imageOnErrorHandler = this.imageOnErrorHandler.bind(this);
    this.imageOnLoadHandler = this.imageOnLoadHandler.bind(this);
    this.imageInScreenHandler = this.imageInScreenHandler.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    const {
      content,
      isContentLoaded,
    } = this.props;
    if (!isContentLoaded) {
      if ('IntersectionObserver' in window) {
        const wrapper = this.wrapperRef.current;
        const { columnsInPage } = Connector.setting.getSetting();
        this.observer = new IntersectionObserver((entries) => {
          if (entries.some(({ isIntersecting, intersectionRatio }) => isIntersecting || intersectionRatio > 0)) {
            this.imageInScreenHandler();
            this.observer.unobserve(wrapper);
            this.observer = null;
          }
        }, { threshold: 0, rootMargin: `${200 * columnsInPage}%` });
        this.observer.observe(wrapper);
      } else {
        this.timeout = setTimeout(this.imageInScreenHandler, (content.index - 1) * 200);
      }
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.unobserve(this.wrapperRef.current);
      this.observer = null;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
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

  imageInScreenHandler() {
    this.setState({ imageInScreen: true });
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
        className="img"
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
    const { isContentLoaded, ratio } = this.props.content;
    const { imageInScreen } = this.state;
    const { viewType } = Connector.setting.getSetting();
    const style = {};
    const renderImage = imageInScreen || isContentLoaded;

    if (viewType === ViewType.SCROLL) {
      style.paddingBottom = ratio === PRE_CALCULATED_RATIO ? '140%' : `${ratio * 100}%`;
    }
    return (
      <section
        ref={this.wrapperRef}
        className={`image_container ${isContentLoaded ? 'loaded' : ''} ${contentFooter ? 'has_content_footer' : ''}`}
        style={style}
      >
        {renderImage && this.renderImage()}
        {renderImage && contentFooter}
      </section>
    );
  }
}

ImageContent.defaultProps = {
  contentFooter: null,
};

ImageContent.propTypes = {
  src: PropTypes.string,
  content: ContentType.isRequired,
  contentFooter: PropTypes.node,
  isCalculated: PropTypes.bool,
};

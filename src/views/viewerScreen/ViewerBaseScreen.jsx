import React from 'react';
import PropTypes from 'prop-types';
import { VIEWER_EMPTY_READ_POSITION } from '../../constants/ViewerScreenConstants';
import { isExist } from '../../util/Util';
import { ContentFormat } from '../../constants/ContentConstants';
import ViewerHelper from '../../util/viewerScreen/ViewerHelper';
import LazyLoadImage from '../LazyLoadImage';


export default class ViewerBaseScreen extends React.Component {
  pageViewStyle() {
  }

  contentFooterStyle() {
    return ViewerHelper.getContentFooterStyle();
  }

  checkEmptyPosition() {
    const { readPosition } = this.props;
    return (readPosition === VIEWER_EMPTY_READ_POSITION || !isExist(readPosition));
  }

  renderContent() {
    const {
      contentFormat,
      spines,
      images,
      lazyLoadMargin,
    } = this.props;

    if (contentFormat === ContentFormat.EPUB) {
      return Object.keys(spines).map((key) => {
        const index = parseInt(key, 10);
        const spacer = `<pre id="${ViewerHelper.getChapterIndicatorId(index + 1)}"></pre>`;
        return (
          <article
            id={ViewerHelper.getChapterId(index + 1)}
            className={`chapter${index === 0 ? ' first' : ''}${index === Object.keys(spines).length - 1 ? ' last' : ''}`}
            dangerouslySetInnerHTML={{ __html: `${spacer} ${spines[index]}` }}
          />
        );
      });
    }
    if (contentFormat === ContentFormat.IMAGE) {
      return images.map((image, index) => (
        <LazyLoadImage
          key={image.src}
          src={image.src}
          className={`${index === 0 ? ' first' : ''}${index === images.length - 1 ? ' last' : ''}`}
          lazyLoadMargin={lazyLoadMargin}
        />
      ));
    }
    return null;
  }
}

ViewerBaseScreen.propTypes = {
  readPosition: PropTypes.string,
  contentFormat: PropTypes.string,
  spines: PropTypes.object,
  images: PropTypes.array,
  lazyLoadMargin: PropTypes.number.isRequired,
};

ViewerBaseScreen.defaultProps = {
  readPosition: VIEWER_EMPTY_READ_POSITION,
};

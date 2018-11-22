import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectReaderCurrentContentIndex } from '@ridi/react-viewer';
import { selectIsFullScreen } from '../../redux/Viewer.selector';

const ViewerHeader = ({ contentMeta, isFullScreen, currentContentIndex }) => (
  <header id="story_header">
    <nav className={`top_nav_bar viewer_header no_button ${isFullScreen ? '' : 'active'}`}>
      <div className="nav_first_line">
        <div className="page_title">
          <h2 className="title_text">
            {`${contentMeta.title} (Chapter ${currentContentIndex})`}
          </h2>
        </div>
      </div>
      <hr className="clear_both" />
    </nav>
  </header>
);

ViewerHeader.propTypes = {
  contentMeta: PropTypes.object.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  currentContentIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const mapStateToProps = state => ({
  isFullScreen: selectIsFullScreen(state),
  currentContentIndex: selectReaderCurrentContentIndex(state),
});

export default connect(mapStateToProps)(ViewerHeader);

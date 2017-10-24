import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectIsFullScreen,
  selectViewerScreenSettings,
  selectIsLoadingCompleted,
} from '../../../../lib/index';
import { onToggleViewerSetting } from '../../redux/Viewer.action';
import ViewerPageFooterToolbar from './ViewerPageFooterToolbar';
import { ViewerType } from '../../../../src/constants/ViewerScreenConstants';
import { ContentType } from '../../../../src/constants/ContentConstants';
import ViewerNovelSettingPopup from '../settings/ViewerNovelSettingPopup';
import ViewerComicSettingPopup from '../settings/ViewerComicSettingPopup';
import ViewerFooterToolbar from './ViewerFooterToolbar';
import ViewerFooterTabbar from '../tabbars/ViewerFooterTabbar';
import ViewerFooterTabItem from '../tabbars/ViewerFooterTabItem';
import { preventScrollEvent } from '../../../../src/util/CommonUi';


class ViewerFooter extends Component {
  render() {
    const {
      isFullScreen,
      content,
      episode,
      isPrevEpisodeAvailable,
      isNextEpisodeAvailable,
      prevEpisodeUrl,
      nextEpisodeUrl,
      isVisibleSettingPopup,
      toggleViewerSetting,
    } = this.props;
    const { viewerType } = this.props.viewerScreenSettings;

    return (
      <section ref={(footer) => { preventScrollEvent(footer); }}>
        {content.content_type === ContentType.WEB_NOVEL ?
          <ViewerNovelSettingPopup content={content} /> :
          <ViewerComicSettingPopup content={content} />
        }
        <footer
          className={`viewer_footer ${isFullScreen ? '' : 'active'}`}
          ref={(footer) => {
            this.footer = footer;
            preventScrollEvent(footer);
          }}
        >
          {viewerType === ViewerType.PAGE ? <ViewerPageFooterToolbar /> : null}
          <ViewerFooterToolbar
            title={episode.title}
            isPrevEpisodeAvailable={isPrevEpisodeAvailable}
            isNextEpisodeAvailable={isNextEpisodeAvailable}
            prevEpisodeUrl={prevEpisodeUrl}
            nextEpisodeUrl={nextEpisodeUrl}
          />
          <ViewerFooterTabbar>
            <ViewerFooterTabItem
              title="보기설정"
              icon="setting"
              isSelected={isVisibleSettingPopup}
              onClickTabItem={() => toggleViewerSetting()}
            />
          </ViewerFooterTabbar>
        </footer>
      </section>
    );
  }
}

ViewerFooter.propTypes = {
  content: PropTypes.object.isRequired,
  episode: PropTypes.object.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  viewerScreenSettings: PropTypes.object,
  isPrevEpisodeAvailable: PropTypes.bool.isRequired,
  isNextEpisodeAvailable: PropTypes.bool.isRequired,
  prevEpisodeUrl: PropTypes.string,
  nextEpisodeUrl: PropTypes.string,
  isVisibleSettingPopup: PropTypes.bool.isRequired,
  toggleViewerSetting: PropTypes.func.isRequired,
};

ViewerFooter.defaultProps = {
  viewerScreenSettings: {},
  prevEpisodeUrl: null,
  nextEpisodeUrl: null,
};

const mapStateToProps = (state, ownProps) => {
  const { content, episode } = ownProps;
  const { ui } = state.viewer;
  const { isVisibleSettingPopup } = ui;
  const isLoadingCompleted = selectIsLoadingCompleted(state);
  const isLoaded = content && episode && isLoadingCompleted;
  const isPrevEpisodeAvailable = isLoaded;
  const isNextEpisodeAvailable = isLoaded;
  const prevEpisodeUrl = '';
  const nextEpisodeUrl = '';

  return {
    isFullScreen: selectIsFullScreen(state),
    isVisibleSettingPopup,
    viewerScreenSettings: selectViewerScreenSettings(state),
    isPrevEpisodeAvailable,
    isNextEpisodeAvailable,
    prevEpisodeUrl,
    nextEpisodeUrl,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleViewerSetting: () => dispatch(onToggleViewerSetting()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerFooter);

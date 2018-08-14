import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectReaderSetting, ViewType } from '../../../../lib';
import { ContentType } from '../../constants/ContentConstants';
import { onToggleViewerSetting } from '../../redux/Viewer.action';
import { selectIsFullScreen } from '../../redux/Viewer.selector';
import ViewerPageFooterToolbar from './ViewerPageFooterToolbar';
import ViewerNovelSettingPopup from '../settings/ViewerNovelSettingPopup';
import ViewerComicSettingPopup from '../settings/ViewerComicSettingPopup';
import ViewerFooterTabbar from '../tabbars/ViewerFooterTabbar';
import ViewerFooterTabItem from '../tabbars/ViewerFooterTabItem';

class ViewerFooter extends Component {
  render() {
    const {
      isFullScreen,
      content,
      isVisibleSettingPopup,
      toggleViewerSetting,
    } = this.props;
    const { viewType } = this.props.setting;

    return (
      <section>
        {content.contentType === ContentType.WEB_NOVEL ?
          <ViewerNovelSettingPopup content={content} /> :
          <ViewerComicSettingPopup content={content} />
        }
        <footer
          className={`viewer_footer ${isFullScreen ? '' : 'active'}`}
          ref={(footer) => { this.footer = footer; }}
        >
          {viewType === ViewType.PAGE ? <ViewerPageFooterToolbar /> : null}
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
  isFullScreen: PropTypes.bool.isRequired,
  setting: PropTypes.object.isRequired,
  isVisibleSettingPopup: PropTypes.bool.isRequired,
  toggleViewerSetting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { ui } = state.viewer;
  const { isVisibleSettingPopup } = ui;

  return {
    isFullScreen: selectIsFullScreen(state),
    isVisibleSettingPopup,
    setting: selectReaderSetting(state),
  };
};

const mapDispatchToProps = dispatch => ({
  toggleViewerSetting: () => dispatch(onToggleViewerSetting()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerFooter);

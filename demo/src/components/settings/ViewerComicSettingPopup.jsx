import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { viewerScreenSettingChanged } from '../../../../lib/index';
import { selectIsVisibleSettingPopup } from '../../redux/Viewer.selector';
import ThemeSetting from './ThemeSetting';
import ViewerTypeSetting from './ViewerTypeSetting';
import ComicSpineSetting from './ComicSpineSetting';
import { ViewerComicSpinType } from '../../../../src/constants/ViewerScreenConstants';
import { updateViewerSettings as updateViewerSettingsAction } from '../../redux/ViewerUi.action';


class ViewerComicSettingPopup extends Component {
  render() {
    const { content, isVisibleSettingPopup, updateViewerSettings, updateViewerScreenSettings } = this.props;

    return (
      <div
        id="setting_popup"
        className={`${isVisibleSettingPopup ? 'active' : ''} android_setting_popup`}
      >
        <h2 className="indent_hidden">보기설정 팝업</h2>
        <ul className="setting_group">
          <ThemeSetting
            onChanged={colorTheme => updateViewerScreenSettings({ colorTheme })}
          />
          <ViewerTypeSetting
            onChanged={viewerType => updateViewerScreenSettings({ viewerType })}
            contentViewerType={content.viewer_type}
          />
          {ViewerComicSpinType.toList().map(item => (
            <ComicSpineSetting
              item={item}
              key={item}
              onChanged={changedSetting => updateViewerScreenSettings(changedSetting)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

ViewerComicSettingPopup.propTypes = {
  content: PropTypes.object.isRequired,
  isVisibleSettingPopup: PropTypes.bool.isRequired,
  updateViewerSettings: PropTypes.func.isRequired,
  updateViewerScreenSettings: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isVisibleSettingPopup: selectIsVisibleSettingPopup(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateViewerScreenSettings: changedSettings => dispatch(viewerScreenSettingChanged(changedSettings)),
  updateViewerSettings: changedSettings => dispatch(updateViewerSettingsAction(changedSettings)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerComicSettingPopup);

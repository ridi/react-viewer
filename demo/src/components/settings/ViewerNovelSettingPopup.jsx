import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { viewerScreenSettingChanged, PageCalculator } from '../../../../lib/index';
import ThemeSetting from './ThemeSetting';
import ViewerTypeSetting from './ViewerTypeSetting';
import FontSetting from './FontSetting';
import NovelSpineSetting from './NovelSpineSetting';
import { ViewerSpinType } from '../../../../src/constants/ViewerScreenConstants';
import { selectIsVisibleSettingPopup } from '../../redux/Viewer.selector';


const ViewerNovelSettingPopup = ({ content, isVisibleSettingPopup, updateViewerScreenSettings }) => (
  <div
    id="setting_popup"
    className={`${isVisibleSettingPopup ? 'active' : ''} 'android_setting_popup`}
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
      <FontSetting
        onChanged={font => updateViewerScreenSettings({ font })}
      />
      {ViewerSpinType.toList().map(item => (
        <NovelSpineSetting
          item={item}
          key={item}
          onChanged={changedSetting => updateViewerScreenSettings(changedSetting)}
        />
      ))}
    </ul>
  </div>
);

ViewerNovelSettingPopup.propTypes = {
  content: PropTypes.object.isRequired,
  isVisibleSettingPopup: PropTypes.bool.isRequired,
  updateViewerScreenSettings: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isVisibleSettingPopup: selectIsVisibleSettingPopup(state),
});

const mapDispatchToProps = dispatch => ({
  updateViewerScreenSettings: (changedSettings) => {
    dispatch(viewerScreenSettingChanged(changedSettings));
    PageCalculator.updatePagination();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerNovelSettingPopup);

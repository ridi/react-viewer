import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThemeSetting from './ThemeSetting';
import ViewerTypeSetting from './ViewerTypeSetting';
import ComicSpineSetting from './ComicSpineSetting';
import { ViewerComicSpinType } from '../../../../src/constants/ViewerScreenConstants';
import BaseSettingPopup, { mapStateToProps, mapDispatchToProps } from './BaseSettingPopup';

class ViewerComicSettingPopup extends BaseSettingPopup {
  renderSettings() {
    const { content } = this.props;
    return (
      <ul className="setting_group">
        <ThemeSetting
          onChanged={colorTheme => this.onSettingChanged({ colorTheme })}
        />
        <ViewerTypeSetting
          onChanged={viewerType => this.onSettingChanged({ viewerType })}
          contentViewerType={content.viewer_type}
        />
        {ViewerComicSpinType.toList().map(item => (
          <ComicSpineSetting
            item={item}
            key={item}
            onChanged={changedSetting => this.onSettingChanged(changedSetting)}
          />
        ))}
      </ul>
    );
  }
}

ViewerComicSettingPopup.propTypes = {
  content: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerComicSettingPopup);

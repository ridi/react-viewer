import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThemeSetting from './ThemeSetting';
import ViewerTypeSetting from './ViewerTypeSetting';
import ComicSpineSetting from './ComicSpineSetting';
import ColumnSetting from './ColumnSetting';
import { ViewerComicSpinType, ViewerType } from '../../../../lib';
import BaseSettingPopup, { mapStateToProps, mapDispatchToProps } from './BaseSettingPopup';

class ViewerComicSettingPopup extends BaseSettingPopup {
  renderSettings() {
    const { content, setting } = this.props;
    return (
      <ul className="setting_group">
        <ThemeSetting
          onChanged={colorTheme => this.onSettingChanged({ colorTheme })}
        />
        <ViewerTypeSetting
          onChanged={viewerType => this.onSettingChanged({ viewerType })}
          contentViewerType={content.viewer_type}
        />
        { setting.viewerType === ViewerType.PAGE
          ? <ColumnSetting onChanged={columnsInPage => this.onSettingChanged({ columnsInPage })} /> : null }
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

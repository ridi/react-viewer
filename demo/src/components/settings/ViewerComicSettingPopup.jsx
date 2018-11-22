import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ViewType } from '@ridi/react-viewer';
import ThemeSetting from './ThemeSetting';
import ViewTypeSetting from './ViewTypeSetting';
import ComicSpineSetting from './ComicSpineSetting';
import ColumnSetting from './ColumnSetting';
import { ViewerComicSpinType } from '../../constants/SettingConstants';
import BaseSettingPopup, { mapStateToProps } from './BaseSettingPopup';

class ViewerComicSettingPopup extends BaseSettingPopup {
  renderSettings() {
    const { contentMeta, setting } = this.props;
    return (
      <ul className="setting_group">
        <ThemeSetting
          onChanged={colorTheme => this.onSettingChanged({ colorTheme })}
        />
        <ViewTypeSetting
          onChanged={viewType => this.onSettingChanged({ viewType })}
          contentViewType={contentMeta.viewType}
        />
        { setting.viewType === ViewType.PAGE
          ? <ColumnSetting onChanged={changedSetting => this.onSettingChanged(changedSetting)} /> : null }
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
  contentMeta: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ViewerComicSettingPopup);

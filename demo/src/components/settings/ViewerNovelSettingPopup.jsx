import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThemeSetting from './ThemeSetting';
import ViewerTypeSetting from './ViewerTypeSetting';
import FontSetting from './FontSetting';
import NovelSpineSetting from './NovelSpineSetting';
import { PageCalculator } from '../../../../lib/index';
import { ViewerSpinType } from '../../../../src/constants/ViewerScreenConstants';
import BaseSettingPopup, { mapStateToProps, mapDispatchToProps } from './BaseSettingPopup';

const settingsAffectingPagination = ['font', 'fontSizeLevel', 'paddingLevel', 'contentWidthLevel', 'lineHeightLevel'];

class ViewerNovelSettingPopup extends BaseSettingPopup {
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);

    // recalculate pagination on some specific settings changed
    if (this.shouldUpdatePagination(this.props, nextProps)) {
      PageCalculator.updatePagination(true);
    }
  }

  shouldUpdatePagination(currentProps, nextProps) {
    const current = settingsAffectingPagination.map(key => currentProps.viewerScreenSettings[key]);
    const next = settingsAffectingPagination.map(key => nextProps.viewerScreenSettings[key]);
    return JSON.stringify(current) !== JSON.stringify(next);
  }

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
        <FontSetting
          onChanged={font => this.onSettingChanged({ font })}
        />
        {ViewerSpinType.toList().map(item => (
          <NovelSpineSetting
            item={item}
            key={item}
            onChanged={changedSetting => this.onSettingChanged(changedSetting)}
          />
        ))}
      </ul>
    );
  }
}

ViewerNovelSettingPopup.propTypes = {
  content: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerNovelSettingPopup);

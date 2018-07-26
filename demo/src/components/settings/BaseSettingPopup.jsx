import React from 'react';
import PropTypes from 'prop-types';
import { selectReaderSetting, ViewType, Connector } from '../../../../lib';
import { selectIsVisibleSettingPopup } from '../../redux/Viewer.selector';

const settingsAffectingPagination = ['viewType', 'font', 'fontSizeLevel', 'paddingLevel', 'contentWidthLevel', 'lineHeightLevel', 'columnsInPage', 'startWithBlankPage'];

export default class BaseSettingPopup extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { colorTheme: nextTheme } = nextProps.setting;
    const { colorTheme: currentTheme } = this.props.setting;

    if (nextTheme !== currentTheme) {
      document.body.className = nextTheme;
    }
  }

  componentDidUpdate(prevProps) {
    // recalculate pagination on some specific settings changed
    if (this.shouldUpdatePagination(prevProps, this.props)) {
      Connector.calculations.invalidate();
    }
  }

  onSettingChanged(settings) {
    Connector.setting.updateSetting(settings);
  }

  shouldUpdatePagination(currentProps, nextProps) {
    const current = settingsAffectingPagination.map(key => currentProps.setting[key]);
    const next = settingsAffectingPagination.map(key => nextProps.setting[key]);
    return JSON.stringify(current) !== JSON.stringify(next);
  }

  renderSettings() {
    return null;
  }

  render() {
    const { isVisibleSettingPopup, setting } = this.props;
    return (
      <div
        id="setting_popup"
        className={`
          ${setting.viewType === ViewType.PAGE ? 'page_setting_popup' : ''}
          ${isVisibleSettingPopup ? 'active' : ''}
          android_setting_popup
        `}
      >
        <h2 className="indent_hidden">보기설정 팝업</h2>
        {this.renderSettings()}
      </div>
    );
  }
}

BaseSettingPopup.propTypes = {
  setting: PropTypes.object.isRequired,
  isVisibleSettingPopup: PropTypes.bool.isRequired,
};

export const mapStateToProps = state => ({
  isVisibleSettingPopup: selectIsVisibleSettingPopup(state),
  setting: selectReaderSetting(state),
});

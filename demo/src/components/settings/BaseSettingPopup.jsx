import React from 'react';
import PropTypes from 'prop-types';
import { selectReaderSetting, ViewType, EventBus, Events } from '@ridi/react-viewer';
import { selectIsVisibleSettingPopup } from '../../redux/Viewer.selector';

export default class BaseSettingPopup extends React.Component {
  componentDidUpdate(prevProps) {
    const { colorTheme: theme } = this.props.setting;
    const { colorTheme: prevTheme } = prevProps.setting;

    if (theme !== prevTheme) {
      document.body.className = theme;
    }
  }

  onSettingChanged(settings) {
    EventBus.emit(Events.setting.UPDATE_SETTING, settings);
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

import React from 'react';
import PropTypes from 'prop-types';
import { viewerScreenSettingChanged, selectViewerScreenSettings } from '../../../../lib/index';
import { selectIsVisibleSettingPopup } from '../../redux/Viewer.selector';

export default class BaseSettingPopup extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { colorTheme: nextTheme } = nextProps.viewerScreenSettings;
    const { colorTheme: currentTheme } = this.props.viewerScreenSettings;

    if (nextTheme !== currentTheme) {
      document.body.className = nextTheme;
    }
  }

  onSettingChanged(settings) {
    const { updateViewerScreenSettings } = this.props;
    updateViewerScreenSettings(settings);
  }

  renderSettings() {
    return null;
  }

  render() {
    const { isVisibleSettingPopup } = this.props;
    return (
      <div
        id="setting_popup"
        className={`${isVisibleSettingPopup ? 'active' : ''} 'android_setting_popup`}
      >
        <h2 className="indent_hidden">보기설정 팝업</h2>
        {this.renderSettings()}
      </div>
    );
  }
}

BaseSettingPopup.propTypes = {
  viewerScreenSettings: PropTypes.object.isRequired,
};

BaseSettingPopup.propTypes = {
  isVisibleSettingPopup: PropTypes.bool.isRequired,
  updateViewerScreenSettings: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
  isVisibleSettingPopup: selectIsVisibleSettingPopup(state),
  viewerScreenSettings: selectViewerScreenSettings(state),
});

export const mapDispatchToProps = dispatch => ({
  updateViewerScreenSettings: changedSettings => dispatch(viewerScreenSettingChanged(changedSettings)),
});

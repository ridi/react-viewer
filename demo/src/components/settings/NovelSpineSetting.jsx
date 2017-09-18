import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectViewerScreenSettings } from '../../../../lib/index';
import SpinButton from './SpinButton';
import { ViewerSpinType } from '../../../../src/constants/ViewerScreenConstants';
import SvgIcons from '../icons/SvgIcons';
import { preventScrollEvent } from '../../../../src/util/CommonUi';


class NovelSpineSetting extends Component {
  render() {
    const { item, onChanged, viewerScreenSettings } = this.props;

    return (
      <li className="setting_list" key={item} ref={list => { preventScrollEvent(list); }}>
        <SvgIcons
          svgName={`svg_${item}_2`}
          svgClass={`setting_title_icon svg_${item}_icon`}
        />
        <SpinButton
          title={ViewerSpinType.toString(item)}
          buttonTarget={`set_${item}`}
          initialValue={{
            [ViewerSpinType.FONT_SIZE]: viewerScreenSettings.fontSizeLevel,
            [ViewerSpinType.LINE_HEIGHT]: viewerScreenSettings.lineHeightLevel,
            [ViewerSpinType.PADDING]: viewerScreenSettings.paddingLevel,
          }[item]}
          min={{
            [ViewerSpinType.FONT_SIZE]: 1,
            [ViewerSpinType.LINE_HEIGHT]: 1,
            [ViewerSpinType.PADDING]: 1,
          }[item]}
          max={{
            [ViewerSpinType.FONT_SIZE]: 12,
            [ViewerSpinType.LINE_HEIGHT]: 6,
            [ViewerSpinType.PADDING]: 6,
          }[item]}
          onChange={(oldLevel, newLevel) => onChanged({
            [ViewerSpinType.toReaderSettingType(item)]: newLevel,
          })}
        />
      </li>
    );
  }
}

NovelSpineSetting.propTypes = {
  item: PropTypes.string.isRequired,
  onChanged: PropTypes.func.isRequired,
  viewerScreenSettings: PropTypes.object,
};

NovelSpineSetting.defaultProps = {
  viewerScreenSettings: {},
};

const mapStateToProps = (state, ownProps) => ({
  viewerScreenSettings: selectViewerScreenSettings(state),
});

export default connect(
  mapStateToProps,
)(NovelSpineSetting);

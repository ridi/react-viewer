import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSetting } from '../../../../lib';
import SpinButton from './SpinButton';
import { ViewerSpinType } from '../../../../src/constants/ViewerScreenConstants';
import SvgIcons from '../icons/SvgIcons';

const NovelSpineSetting = ({ item, onChanged, setting }) => (
  <li className="setting_list" key={item}>
    <SvgIcons
      svgName={`svg_${item}_2`}
      svgClass={`setting_title_icon svg_${item}_icon`}
    />
    <SpinButton
      title={ViewerSpinType.toString(item)}
      buttonTarget={`set_${item}`}
      initialValue={{
      [ViewerSpinType.FONT_SIZE]: setting.fontSizeLevel,
      [ViewerSpinType.LINE_HEIGHT]: setting.lineHeightLevel,
      [ViewerSpinType.PADDING]: setting.paddingLevel,
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

NovelSpineSetting.propTypes = {
  item: PropTypes.string.isRequired,
  onChanged: PropTypes.func.isRequired,
  setting: PropTypes.object,
};

NovelSpineSetting.defaultProps = {
  setting: {},
};

const mapStateToProps = state => ({
  setting: selectSetting(state),
});

export default connect(mapStateToProps)(NovelSpineSetting);

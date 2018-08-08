import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectReaderSetting, CONTENT_WIDTH_RANGE } from '../../../../lib';
import { ViewerComicSpinType } from '../../constants/SettingConstants';
import SpinButton from './SpinButton';
import SvgIcons from '../icons/SvgIcons';
import { preventScrollEvent } from '../../../../src/util/CommonUi';


class ComicSpineSetting extends Component {
  render() {
    const { item, onChanged, setting } = this.props;

    return (
      <li className="setting_list" key={item} ref={(list) => { preventScrollEvent(list); }}>
        <SvgIcons
          svgName={`svg_${item}_1`}
          svgClass={`setting_title_icon svg_${item}_icon`}
        />
        <SpinButton
          title={ViewerComicSpinType.toString(item)}
          buttonTarget={`set_${item}`}
          initialValue={{
            [ViewerComicSpinType.CONTENT_WIDTH]: setting.contentWidthInPercent,
          }[item]}
          min={{
            [ViewerComicSpinType.CONTENT_WIDTH]: CONTENT_WIDTH_RANGE[0],
          }[item]}
          max={{
            [ViewerComicSpinType.CONTENT_WIDTH]: CONTENT_WIDTH_RANGE[1],
          }[item]}
          onChange={(oldLevel, newLevel) => onChanged({
            [ViewerComicSpinType.toReaderSettingType(item)]: newLevel,
          })}
        />
      </li>
    );
  }
}

ComicSpineSetting.propTypes = {
  item: PropTypes.string.isRequired,
  onChanged: PropTypes.func,
  setting: PropTypes.object,
};

ComicSpineSetting.defaultProps = {
  onChanged: () => {},
  setting: {},
};

const mapStateToProps = state => ({
  setting: selectReaderSetting(state),
});

export default connect(mapStateToProps)(ComicSpineSetting);

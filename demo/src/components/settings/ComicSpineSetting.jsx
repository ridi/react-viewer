import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectViewerScreenSettings } from '../../../../lib/index';
import SpinButton from './SpinButton';
import { ViewerComicSpinType } from '../../../../src/constants/ViewerScreenConstants';
import SvgIcons from '../icons/SvgIcons';
import { preventScrollEvent } from '../../../../src/util/CommonUi';


class ComicSpineSetting extends Component {
  render() {
    const { item, onChanged, viewerScreenSettings } = this.props;

    return (
      <li className="setting_list" key={item} ref={list => { preventScrollEvent(list); }}>
        <SvgIcons
          svgName={`svg_${item}_1`}
          svgClass={`setting_title_icon svg_${item}_icon`}
        />
        <SpinButton
          title={ViewerComicSpinType.toString(item)}
          buttonTarget={`set_${item}`}
          initialValue={{
            [ViewerComicSpinType.CONTENT_WIDTH]: viewerScreenSettings.contentWidthLevel,
          }[item]}
          min={{
            [ViewerComicSpinType.CONTENT_WIDTH]: 1,
          }[item]}
          max={{
            [ViewerComicSpinType.CONTENT_WIDTH]: 6,
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
  viewerScreenSettings: PropTypes.object,
};

ComicSpineSetting.defaultProps = {
  onChanged: () => {},
  viewerScreenSettings: {},
};

const mapStateToProps = (state, ownProps) => ({
  viewerScreenSettings: selectViewerScreenSettings(state),
});

export default connect(
  mapStateToProps,
)(ComicSpineSetting);

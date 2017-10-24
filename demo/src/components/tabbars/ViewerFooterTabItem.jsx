import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SvgIcons from '../icons/SvgIcons';
import { isExist } from '../../../../src/util/Util';


export default class ViewerFooterTabItem extends Component {
  constructor() {
    super();
    this.colorList = {
      normal: '#868a8e',
      active: '#0282da',
    };
    this.iconList = {
      android: {
        list: {
          normal: 'svg_list_fill_1',
          active: 'svg_list_fill_1',
        },
        ticket: {
          normal: 'svg_ticket_fill_1',
          active: 'svg_ticket_fill_1',
        },
        comment: {
          normal: 'svg_comment_fill_1',
          active: 'svg_comment_fill_1',
        },
        setting: {
          normal: 'svg_setting_fill_1',
          active: 'svg_setting_fill_1',
        },
      },
      ios: {
        list: {
          normal: 'svg_list_1',
          active: 'svg_list_fill_1',
        },
        ticket: {
          normal: 'svg_ticket_1',
          active: 'svg_ticket_fill_1',
        },
        comment: {
          normal: 'svg_comment_1',
          active: 'svg_comment_fill_1',
        },
        setting: {
          normal: 'svg_setting_1',
          active: 'svg_setting_fill_1',
        },
      },
    };
  }

  getColor() {
    const { icon, isSelected } = this.props;

    if (!isExist(icon)) {
      return '';
    }

    if (isSelected) {
      return this.colorList.active;
    }
    return this.colorList.normal;
  }

  getIconName() {
    const { icon, isSelected } = this.props;

    if (!isExist(icon)) {
      return '';
    }

    const iconObj = this.iconList.ios;
    if (isSelected) {
      return iconObj[icon].active;
    }
    return iconObj[icon].normal;
  }

  render() {
    const { onClickTabItem, isSelected, title } = this.props;

    return (
      <div className="viewer_footer_tabitem">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClickTabItem();
          }}
          disabled={Boolean(false)}
        >
          <div className={`viewer_footer_tabitem_content_wrapper ${(isSelected) ? 'active' : ''}`}>
            <SvgIcons
              svgName={this.getIconName()}
              svgClass={`viewer_footer_tabitem_icon ${this.getIconName()}`}
              svgColor={this.getColor()}
            />
            <span className="viewer_footer_tabitem_title">{title}</span>
          </div>
        </button>
      </div>
    );
  }
}

ViewerFooterTabItem.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClickTabItem: PropTypes.func.isRequired,
};

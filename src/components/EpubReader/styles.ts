import {css} from '@emotion/core';
import {getClientHeight, getClientWidth} from '../../util';
import {SettingState, ViewType} from '../../contexts/index';
import * as SettingUtil from '../../SettingUtil';

export const wrapper = (setting: SettingState) => {
  if (setting.viewType === ViewType.SCROLL) {
    return css``;
  }

  const columnGap = SettingUtil.columnGap(setting);
  const columnsInPage = SettingUtil.columnsInPage(setting);
  return css `
    -webkit-column-width: ${(getClientWidth() - (columnGap * (columnsInPage - 1))) / columnsInPage}px;
    -webkit-column-gap: ${columnGap}px;
    height: ${getClientHeight()}px;
    
    article {
      -webkit-column-break-before: always;
      break-before: column;
    }
  `;
};

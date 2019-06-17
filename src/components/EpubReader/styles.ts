import { css } from '@emotion/core';
import { SettingState } from '../../contexts';
import * as SettingUtil from '../../SettingUtil';

const scrollContentWrapper = () => css`
  article: {
    margin-bottom: 50px;
  }
`;

const pageContentWrapper = (setting: SettingState) => css`
  column-width: ${SettingUtil.columnWidth(setting)}px;
  column-gap: ${SettingUtil.columnGap(setting)}px;
  column-fill: auto;
  height: 100%;
  
  article {
    -webkit-column-break-before: always;
    break-before: column;
  }
`;

export const contentWrapper = (setting: SettingState) => {
  if (SettingUtil.isScroll(setting)) {
    return scrollContentWrapper();
  }
  return pageContentWrapper(setting);
};

export const wrapper = (setting: SettingState) => {
  if (SettingUtil.isScroll(setting)) {
    return css`
      margin: ${setting.containerVerticalMargin}px ${setting.containerHorizontalMargin}px;
    `;
  }

  const clientWidth = SettingUtil.containerWidth(setting);
  const clientHeight = SettingUtil.containerHeight(setting);
  return css `
    width: ${clientWidth}px;
    height: ${clientHeight}px;
    margin: ${setting.containerVerticalMargin}px ${setting.containerHorizontalMargin + SettingUtil.contentPadding(setting)}px;
    overflow: hidden;
  `;
};

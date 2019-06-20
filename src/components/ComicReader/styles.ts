import { css } from '@emotion/core';
import { ComicCalculationState, ComicSettingState } from '../../contexts';
import { containerWidth, isScroll } from '../../utils/ComicSettingUtil';
import { getClientHeight } from '../../utils/Util';


export const wrapper = (settingState: ComicSettingState) => {
  if (isScroll(settingState)) {
    return css``;
  }
  return css`
    width: 100%;
    height: ${getClientHeight()}px;
    overflow: hidden;
  `;
};


export const imageContainer = (settingState: ComicSettingState, calculationState: ComicCalculationState) => {
  if (isScroll(settingState)) {
    return css``;
  }

  return css`
    width: ${containerWidth(settingState, calculationState)}px;
    height: ${getClientHeight()}px;
  `;
};


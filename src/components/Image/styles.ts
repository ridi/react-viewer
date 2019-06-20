import { css } from '@emotion/core';
import { ComicSettingState } from '../../contexts';
import { ImageStatus } from '../../constants';
import { contentWidth, isScroll, objectPosition } from '../../utils/ComicSettingUtil';
import { getClientHeight } from '../../utils/Util';

export const wrapper = (setting: ComicSettingState, ratio: number, status: ImageStatus, imageIndex: number) => {
  if (isScroll(setting)) {
    return css`
      width: ${contentWidth(setting)}px;
      height: ${ratio * contentWidth(setting)}px;
      img {
        width: 100%;
        height: 100%;
        opacity: ${status === ImageStatus.LOADED ? 1 : 0};
      }
    `;
  }

  return css`
    width: ${contentWidth(setting)}px;
    height: ${getClientHeight()}px;
    display: inline-block;
    img {
      width: 100%;
      height: 100%;
      opacity: ${status === ImageStatus.LOADED ? 1 : 0};
      object-fit: contain;
      object-position: ${objectPosition(setting, imageIndex)};
    }
  `;
};

export const loading = css`
  width: 100%;
  height: 100%;
  padding-top: 50%;
  padding-left: 50px;
`;
export const error = css`
  width: 100%;
  height: 100%;
  padding-top: 50%;
  padding-left: 50px;
`;
export const blank = (setting: ComicSettingState) => css`
  width: ${contentWidth(setting)}px;
  height: ${getClientHeight()}px;
  display: inline-block;
`;

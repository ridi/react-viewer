import { css } from '@emotion/core';
import { SettingProperties, SettingState } from '../../contexts';
import * as SettingUtil from '../../SettingUtil';

const fontFamilyStyle = (setting: SettingState) => {
  if (setting[SettingProperties.FONT] === 'default') {
    return css ``;
  }
  return css `
    font-family: ${setting[SettingProperties.FONT]} !important;
    p {
      font-family: inherit !important;
    }
  `;
};

const contentsStyle = (setting: SettingState) => {
  return css `
    article {
      word-break: break-word;
      -webkit-tap-highlight-color: transparent;
      
      ${fontFamilyStyle(setting)}
      font-size: ${setting[SettingProperties.FONT_SIZE_IN_EM]}em !important;
      line-height: ${setting[SettingProperties.LINE_HEIGHT_IN_EM]}em !important;

      html {
        padding: 0 !important;
        margin: 0 !important;
        -webkit-writing-mode: horizontal-tb !important;
        writing-mode: horizontal-tb !important;
      }

      p {
        font-size: 1em;
        line-height: inherit !important;
      }

      img,
      video,
      svg {
        max-width: 100%;
        max-height: 95%;
        margin: 0 auto;
        padding: 0;
      }

      pre {
        white-space: pre-wrap;
      }

      a:-webkit-any-link {
        text-decoration: none;
      }

      sup,
      sup a,
      sup span,
      sup p,
      sup br,
      sup strong,
      sup b,
      sup em,
      sup i,
      sub,
      sub a,
      sub span,
      sub p,
      sub br,
      sub strong,
      sub b,
      sub em,
      sub i,
      h1,
      h1 a,
      h1 span,
      h1 p,
      h1 br,
      h1 strong,
      h1 b,
      h1 em,
      h1 i,
      h2,
      h2 a,
      h2 span,
      h2 p,
      h2 br,
      h2 strong,
      h2 b,
      h2 em,
      h2 i,
      h3,
      h3 a,
      h3 span,
      h3 p,
      h3 br,
      h3 strong,
      h3 b,
      h3 em,
      h3 i,
      h4,
      h4 a,
      h4 span,
      h4 p,
      h4 br,
      h4 strong,
      h4 b,
      h4 em,
      h4 i,
      h5,
      h5 a,
      h5 span,
      h5 p,
      h5 br,
      h5 strong,
      h5 b,
      h5 em,
      h5 i,
      h6,
      h6 a,
      h6 span,
      h6 p,
      h6 br,
      h6 strong,
      h6 b,
      h6 em,
      h6 i {
        /* 줄 간격 설정이 원본이 아닐 떼만 */
        line-height: initial !important;
        vertical-align: baseline !important;
      }

      rt,
      rt * {
        text-align: initial !important;
      }

      aside {
        display: none;
      }
    }
  `;
};

const scrollContentWrapper = (setting: SettingState) => css`
  article: {
    padding-bottom: 50px; 
  }
  ${contentsStyle(setting)}
`;

const pageContentWrapper = (setting: SettingState) => css`
  column-width: ${SettingUtil.columnWidth(setting)}px;
  column-gap: ${SettingUtil.columnGap(setting)}px;
  column-fill: auto;
  height: 100%;
  
  article {
    -webkit-column-break-before: always;
    -webkit-column-break-after: always;
    -webkit-column-break-inside: auto;
    break-before: column;
  }
  ${contentsStyle(setting)}
`;

export const contentWrapper = (setting: SettingState) => {
  if (SettingUtil.isScroll(setting)) {
    return scrollContentWrapper(setting);
  }
  return pageContentWrapper(setting);
};

export const wrapper = (setting: SettingState) => {
  if (SettingUtil.isScroll(setting)) {
    return css`
      margin: ${setting.containerVerticalMargin}px ${setting.containerHorizontalMargin + SettingUtil.contentPadding(setting)}px;
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


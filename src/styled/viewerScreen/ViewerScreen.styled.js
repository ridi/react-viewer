/* eslint max-len: 0 */
import styled, { css } from 'styled-components';
import { svgIcons } from '../SvgIcons.styled';
import { NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants/StyledConstants';
import { ContentType } from '../../constants/ContentConstants';
import { ViewerType } from '../../constants/ViewerScreenConstants';
import SvgIconConstants from '../../constants/SvgIconConstants';
import { screenHeight } from '../../util/BrowserWrapper';
import ViewerHelper from '../../util/viewerScreen/ViewerHelper';

const fontFace = fontDomain => `${fontDomain ? `
  @font-face {
    font-family: 'kopub_batang';
    font-style: normal;
    font-weight: normal;
    src: url('${fontDomain}KoPubBatangMedium.woff2') format('woff2'), 
      url('${fontDomain}KoPubBatangMedium.woff') format('woff'), 
      url('${fontDomain}KoPubBatangMedium.ttf') format('truetype');
  }
  @font-face {
    font-family: 'kopub_dotum';
    font-style: normal;
    font-weight: normal;
    src: url('${fontDomain}KoPubDotumMedium.woff2') format('woff2'),
      url('${fontDomain}KoPubDotumMedium.woff') format('woff'),
      url('${fontDomain}KoPubDotumMedium.ttf') format('truetype');
  }
` : ''}`;

// language=SCSS prefix=dummy{ suffix=}
const ViewerScreen = styled.div`
  background: transparent;
`;

// language=SCSS prefix=dummy{ suffix=}
const SizingWrapper = styled.div`
  max-width: ${props => ViewerHelper.getMaxWidth(props.contentType, props.viewerType)};
  margin: 0 auto;
  box-sizing: border-box;
  .error_image_wrapper {
    display: block; width: 100%;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.05);
    .svg_reload_1 {
      display: inline-block; text-indent: -444px; font-size: 0; overflow: hidden;
      background: url("data:image/svg+xml,${svgIcons[SvgIconConstants.RELOAD_1]('rgba(0, 0, 0, 0.4)')}") center center no-repeat;
      background-size: 100% 100%;
      width: 36px; height: 36px; content: '';
    }
  }
`;
SizingWrapper.defaultProps = {
  contentType: ContentType.WEB_NOVEL,
  viewerType: ViewerType.SCROLL,
};

// language=SCSS prefix=dummy{ suffix=}
const novelStyleMixin = css`
  // 리디스토리 커스텀 스타일 -----------------------------------------------------
  p {
    display: block;
    padding: 0.5em;
    text-indent: 1em;
    font-size: 1em;
    text-align: justify;
  }
  h2, h3 {
    padding: 1em 0 0.7em 0;
  }
  .flashback {
    color: #868a8e!important;
  }
  .ridiborder {
    padding: 0.5em 1em;
    border: 0.1em solid #868a8e;
    border-radius: 0.5em;
  }
  .ridibox {
    padding: 0.5em 1em;
  }

  .ridipost {
    padding: 0.5em 1em;
    border-radius: 0.5em;
  }
  .ridicenter {
    text-align: center;
  }
`;

// language=SCSS prefix=dummy{ suffix=}
const ViewerContents = styled.section`
  ${props => fontFace(props.fontDomain)};

  .chapter {
    font-size: ${props => ViewerHelper.getFontSize(props.fontSizeLevel)}px;
    line-height: ${props => ViewerHelper.getNovelLineHeight(props.lineHeight)}em;
    font-family: ${props => props.fontFamily}, system-ui;
    * {
      font-size: 1em;
      line-height: inherit;
      font-family: inherit;
    }
  }
  .comic_page {
    text-align: center;
    line-height: 0;
    img {
      padding: 0;
      width: ${props => `${ViewerHelper.getComicWidth(props.comicWidthLevel)}%`};
    }
  }

  h1, h2, h3, h4, h5, h6, p, th, td, div, label, textarea, a, li, input, button, textarea, select, address {
    letter-spacing: -.01em; word-break: break-all;
  }
  
  h1, h2, h3, h4, h5, h6 {
    text-align: center;
    font-size: 1.3em!important;
    font-weight: bold;
  }

  img {
    max-width: 100%;
    height: auto!important;
    box-sizing: border-box;
  }

  th, td {
    padding: 8px;
  }
  
  ${props => (props.contentType === ContentType.WEB_NOVEL ? novelStyleMixin : '')}
`;
ViewerContents.defaultProps = {
  contentType: ContentType.WEB_NOVEL,
  fontDomain: '',
};

// language=SCSS prefix=dummy{ suffix=}
const PageScreen = ViewerScreen.extend`
  position: fixed; left: 0; top: 0;
  width: 100vw; height: 100vh;
  .left_area, .right_area {
    position: fixed; top: 0;
    display: block;
    height: 100%; width: ${() => ViewerHelper.getLeftRightAreaWidth()}px;
    background: transparent; border: 0;
    cursor: default;
    z-index: 1;
  }
  .left_area { left: 0; }
  .right_area { right: 0; }
  .viewer_bottom {
    min-height: ${() => screenHeight()}px;
    padding: ${NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT + 10}px 0 132px 0;
    box-sizing: border-box;
    user-select: none;
    .viewer_bottom_button_wrapper {
      .move_prev_page_button {
        width: 100%; margin-top: 5px; padding: 15px 0;
        text-align: center; font-size: 14px;
        line-height: 20px;
        .svg_arrow_6_left {
          width: 20px; height: 20px; vertical-align: top;
          margin-right: 8px; content: '';
        }
      }
    }
  }
`;

// language=SCSS prefix=dummy{ suffix=}
const PageContents = ViewerContents.extend`
  .error_image_wrapper {
    height: 100vh; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .pages {
    & > :last-child {
      margin-bottom: ${() => screenHeight() - 1}px !important;
    }
  }
  .comic_page {
    display: flex; height: ${() => screenHeight()}px; overflow: hidden;
    box-sizing: border-box; align-items: center;
    img {
      margin: 0 auto;
      padding: 0;
      box-sizing: border-box;
      width: auto; height: auto;
      max-width: ${props => `${ViewerHelper.getComicWidth(props.comicWidthLevel)}%`};
      max-height: ${() => screenHeight()}px;
    }
    &.lazy_load {
      background-color: rgba(0, 0, 0, 0.1);
      &.loaded {
        width: auto; max-width: none;
        background-color: transparent;
      }
    }
    &.last {
      height: ${() => screenHeight() - ViewerHelper.getContentFooterHeight()}px;
      img {
       max-height: ${() => screenHeight() - ViewerHelper.getContentFooterHeight()}px;
      }
    }
  }
  .content_footer {
    margin: 90px auto 0 auto;
    padding: 15px;
  }
  .comic_page + .content_footer {
    margin-top: 0;
  }
`;

// language=SCSS prefix=dummy{ suffix=}
const ScrollScreen = ViewerScreen.extend`
  padding-bottom: 0;
  .error_image_wrapper {
    padding: 30% 0;
  }
  .viewer_bottom {
    padding: 10px 0 94px 0;
  }
`;

// language=SCSS prefix=dummy{ suffix=}
const ScrollContents = ViewerContents.extend`
  .chapter {
    padding: 0 ${({ contentType, paddingLevel }) => (contentType === ContentType.WEB_NOVEL ? ViewerHelper.getNovelPadding(paddingLevel) : ViewerHelper.getComicPadding(paddingLevel))};
    padding-bottom: ${props => (props.contentType === ContentType.WEB_NOVEL ? '80px' : '0')};
    &.last {
      padding-bottom: 0;
    }
  }
  .content_footer {
    margin-top: 90px;
    padding: 15px ${({ contentType, paddingLevel }) => (contentType === ContentType.WEB_NOVEL ? ViewerHelper.getNovelPadding(paddingLevel) : '15px')};
  }
  img  {
    padding: 15px;
  }
  .comic_page {
    img {
      padding: 0;
    }
    &.lazy_load {
      width: 100%; height: ${() => screenHeight()}px;
      background-color: rgba(0, 0, 0, 0.1);
      &.loaded {
        width: auto; height: auto;
        background-color: transparent;
      }
    }
  }
`;
ScrollContents.defaultProps = {
  contentType: ContentType.WEB_NOVEL,
  fontSizeUnit: 15,
  fontSizeLevel: 4,
  fontFamily: 'dotum',
  lineHeight: 1.70,
  paddingLevel: 3,
  comicWidthLevel: 6,
  fontDomain: '',
};

export { ScrollScreen, PageScreen, SizingWrapper, PageContents, ScrollContents };

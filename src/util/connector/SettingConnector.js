import Connector from '../Connector';
import { screenWidth } from '../BrowserWrapper';
import {
  DEFAULT_PADDING_VERTICAL,
  PAGE_MAX_WIDTH,
  PAGE_VIEWER_SELECTOR,
  EXTENDED_TOUCH_WIDTH,
  CONTENT_FOOTER_HEIGHT,
  CHAPTER_INDICATOR_ID_PREFIX,
  CHAPTER_ID_PREFIX,
} from '../../constants/StyledConstants';
import { ContentFormat, ContentType } from '../../constants/ContentConstants';
import { ViewerType } from '../../constants/ReaderConstants';
import { selectReaderContentFormat, selectReaderSetting } from '../..';
import {
  StyledHtmlPageTouchable,
  StyledHtmlScrollTouchable,
  StyledImagePageTouchable,
  StyledImageScrollTouchable,
} from '../../components/styled/StyledTouchable';
import {
  StyledHtmlPageContent,
  StyledHtmlScrollContent,
  StyledImagePageContent,
  StyledImageScrollContent,
} from '../../components/styled/StyledContent';
import { StyledPageFooter, StyledScrollFooter } from '../../components/styled/StyledFooter';

class SettingConnector extends Connector {
  constructor() {
    super();
    // TODO 모든 옵션 property 또는 redux로 변경하기
    this.options = {
      pageMaxWidth: PAGE_MAX_WIDTH,
      pageViewerSelector: PAGE_VIEWER_SELECTOR,
      extendedTouchWidth: EXTENDED_TOUCH_WIDTH,
      contentFooterHeight: CONTENT_FOOTER_HEIGHT,
    };
  }

  afterConnected() {
    const {
      paddingVertical = DEFAULT_PADDING_VERTICAL,
      pageMaxWidth = PAGE_MAX_WIDTH,
      pageViewerSelector = PAGE_VIEWER_SELECTOR,
      extendedTouchWidth = EXTENDED_TOUCH_WIDTH,
      contentFooterHeight = CONTENT_FOOTER_HEIGHT,
      chapterIndicatorIdPrefix = CHAPTER_INDICATOR_ID_PREFIX,
      chapterIdPrefix = CHAPTER_ID_PREFIX,
    } = this._options;

    this._targetSelector = pageViewerSelector;
    this._paddingVertical = paddingVertical;
    this._pageMaxWidth = pageMaxWidth;
    this._extendedTouchWidth = extendedTouchWidth;
    this._contentFooterHeight = contentFooterHeight;
    this._chapterIndicatorIdPrefix = chapterIndicatorIdPrefix;
    this._chapterIdPrefix = chapterIdPrefix;
  }

  getScrollStyle() {
    return {
      paddingTop: this._paddingVertical,
    };
  }

  getPageMaxWidth() {
    return this._pageMaxWidth || PAGE_MAX_WIDTH;
  }

  getExtendedTouchWidth() {
    return this._extendedTouchWidth || EXTENDED_TOUCH_WIDTH;
  }

  getLeftRightAreaWidth() {
    const clientWidth = screenWidth();
    if (clientWidth >= (this.getPageMaxWidth() - this.getExtendedTouchWidth()) * 2) {
      return `${((clientWidth - this.getPageMaxWidth()) / 2) + this.getExtendedTouchWidth()}px`;
    }
    return `${clientWidth * 0.25}px`;
  }

  getPadding() {
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.IMAGE) return 0;
    const { paddingLevel } = selectReaderSetting(this.getState());
    return `0 ${7 - Number(paddingLevel)}%`;
  }

  getContentWidth() {
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.HTML) return '100%';
    const { contentWidthLevel } = selectReaderSetting(this.getState());
    return `${(Number(contentWidthLevel) * 10) + 40}%`;
  }

  getMaxWidth(contentType, viewerType) {
    if (contentType === ContentType.WEB_NOVEL || viewerType === ViewerType.SCROLL) {
      return `${this.getPageMaxWidth()}px`;
    }
    return 'none';
  }

  getFontSize() {
    const { fontSizeLevel } = selectReaderSetting(this.getState());
    let fontSizeUnit = 16;

    switch (Number(fontSizeLevel)) {
      case 1: fontSizeUnit *= 0.8; break;
      case 2: fontSizeUnit *= 0.85; break;
      case 3: fontSizeUnit *= 0.9; break;
      case 4: fontSizeUnit *= 0.95; break;
      case 5: fontSizeUnit *= 1; break;
      case 6: fontSizeUnit *= 1.15; break;
      case 7: fontSizeUnit *= 1.25; break;
      case 8: fontSizeUnit *= 1.4; break;
      case 9: fontSizeUnit *= 1.6; break;
      case 10: fontSizeUnit *= 1.8; break;
      case 11: fontSizeUnit *= 2.05; break;
      case 12: fontSizeUnit *= 2.3; break;
      default: fontSizeUnit *= 1; break;
    }
    return `${fontSizeUnit}px`;
  }

  getNovelLineHeight() {
    const { lineHeightLevel } = selectReaderSetting(this.getState());
    let lineHeightUnit = 1.67;
    switch (Number(lineHeightLevel)) {
      case 1: lineHeightUnit = 1.35; break;
      case 2: lineHeightUnit = 1.51; break;
      case 3: lineHeightUnit = 1.67; break;
      case 4: lineHeightUnit = 1.85; break;
      case 5: lineHeightUnit = 2.05; break;
      case 6: lineHeightUnit = 2.27; break;
      default: lineHeightUnit = 1.67; break;
    }
    return `${lineHeightUnit}em`;
  }

  getColumnGap() {
    const {
      columnGap,
    } = selectReaderSetting(this.getState());
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.HTML) {
      return `${columnGap}px`;
    }
    return 0;
  }

  getContainerHorizontalMargin() {
    const contentFormat = selectReaderContentFormat(this.getState());
    const { containerHorizontalMargin, viewerType } = selectReaderSetting(this.getState());
    if (contentFormat === ContentFormat.IMAGE && viewerType === ViewerType.PAGE) {
      return '0';
    }
    return `${containerHorizontalMargin}px`;
  }

  getColumnWidth() {
    const { columnsInPage } = selectReaderSetting(this.getState());

    const contentFormat = selectReaderContentFormat(this.getState());
    const calculatedWidth = screenWidth() - (parseInt(this.getContainerHorizontalMargin(), 10) * 2);
    if (contentFormat === ContentFormat.HTML) {
      const width = (columnsInPage > 1) ? calculatedWidth : Math.min(calculatedWidth, this.getPageMaxWidth());
      return `${(width - (parseInt(this.getColumnGap(), 10) * (columnsInPage - 1))) / columnsInPage}px`;
    }
    return `${calculatedWidth / columnsInPage}px`;
  }

  getChapterIndicatorId(chapterNum) {
    return `${this._chapterIndicatorIdPrefix}${chapterNum}`;
  }

  getChapterId(chapterNum) {
    return `${this._chapterIdPrefix}${chapterNum}`;
  }

  getContentFooterHeight() {
    const { contentFooterHeight } = selectReaderSetting(this.getState());
    return contentFooterHeight;
  }

  getStyledTouchable() {
    const contentFormat = selectReaderContentFormat(this.getState());
    const { viewerType } = selectReaderSetting(this.getState());
    if (contentFormat === ContentFormat.HTML && viewerType === ViewerType.SCROLL) {
      return StyledHtmlScrollTouchable;
    } else if (contentFormat === ContentFormat.HTML && viewerType === ViewerType.PAGE) {
      return StyledHtmlPageTouchable;
    } else if (contentFormat === ContentFormat.IMAGE && viewerType === ViewerType.SCROLL) {
      return StyledImageScrollTouchable;
    } else if (contentFormat === ContentFormat.IMAGE && viewerType === ViewerType.PAGE) {
      return StyledImagePageTouchable;
    }
    return null;
  }

  getStyledContent() {
    const contentFormat = selectReaderContentFormat(this.getState());
    const { viewerType } = selectReaderSetting(this.getState());
    if (contentFormat === ContentFormat.HTML && viewerType === ViewerType.SCROLL) {
      return StyledHtmlScrollContent;
    } else if (contentFormat === ContentFormat.HTML && viewerType === ViewerType.PAGE) {
      return StyledHtmlPageContent;
    } else if (contentFormat === ContentFormat.IMAGE && viewerType === ViewerType.SCROLL) {
      return StyledImageScrollContent;
    } else if (contentFormat === ContentFormat.IMAGE && viewerType === ViewerType.PAGE) {
      return StyledImagePageContent;
    }
    return null;
  }

  getStyledFooter() {
    const { viewerType } = selectReaderSetting(this.getState());
    if (viewerType === ViewerType.SCROLL) {
      return StyledScrollFooter;
    } else if (viewerType === ViewerType.PAGE) {
      return StyledPageFooter;
    }
    return null;
  }
}

export default new SettingConnector();

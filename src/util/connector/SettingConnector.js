import Connector from '../Connector';
import { screenWidth } from '../BrowserWrapper';
import {
  CHAPTER_INDICATOR_ID_PREFIX,
  CHAPTER_ID_PREFIX,
  MAX_PADDING_LEVEL,
} from '../../constants/StyledConstants';
import { ContentFormat } from '../../constants/ContentConstants';
import { ViewType } from '../../constants/SettingConstants';
import { selectReaderContentFormat, selectReaderSetting } from '../../redux/selector';
import { updateSetting } from '../../redux/action';
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
import CalculationsConnector from './CalculationsConnector';

const settingsAffectingCalculation = [
  'viewType',
  'font',
  'fontSizeLevel',
  'paddingLevel',
  'contentWidthLevel',
  'lineHeightLevel',
  'columnsInPage',
  'columnGap',
  'startWithBlankPage',
  'containerHorizontalMargin',
  'containerVerticalMargin',
  'maxWidth',
];

class SettingConnector extends Connector {
  getMaxWidth(withUnit = false) {
    const { maxWidth } = selectReaderSetting(this.getState());
    return withUnit ? `${maxWidth}px` : maxWidth;
  }

  getExtendedSideTouchWidth(withUnit = false) {
    const { extendedSideTouchWidth } = selectReaderSetting(this.getState());
    return withUnit ? `${extendedSideTouchWidth}px` : extendedSideTouchWidth;
  }

  getSideTouchWidth(withUnit = false) {
    const clientWidth = screenWidth();
    if (clientWidth >= (this.getMaxWidth() - this.getExtendedSideTouchWidth()) * 2) {
      return `${((clientWidth - this.getMaxWidth()) / 2) + this.getExtendedSideTouchWidth()}px`;
    }
    return withUnit ? `${clientWidth * 0.25}px` : clientWidth * 0.25;
  }

  getHorizontalPadding(withUnit = false) {
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.IMAGE) return 0;
    const { paddingLevel } = selectReaderSetting(this.getState());
    return withUnit ? `${MAX_PADDING_LEVEL - Number(paddingLevel)}%` : MAX_PADDING_LEVEL - Number(paddingLevel);
  }

  getContentWidth(withUnit = false) {
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.HTML) return '100%';
    const { contentWidthLevel } = selectReaderSetting(this.getState());
    const result = (Number(contentWidthLevel) * 10) + 40;
    return withUnit ? `${result}%` : result;
  }

  getFontSize(withUnit = false) {
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
    return withUnit ? `${fontSizeUnit}px` : fontSizeUnit;
  }

  getLineHeight(withUnit = false) {
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
    return withUnit ? `${lineHeightUnit}em` : lineHeightUnit;
  }

  getColumnGap(withUnit = false) {
    const { columnGap } = selectReaderSetting(this.getState());
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.HTML) {
      return withUnit ? `${columnGap}px` : columnGap;
    }
    return withUnit ? '0px' : 0;
  }

  getContainerHorizontalMargin(withUnit = false) {
    const contentFormat = selectReaderContentFormat(this.getState());
    const { containerHorizontalMargin, viewType } = selectReaderSetting(this.getState());
    if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.PAGE) {
      return withUnit ? '0px' : 0;
    }
    return withUnit ? `${containerHorizontalMargin}px` : containerHorizontalMargin;
  }

  getColumnWidth(withUnit = false) {
    const { columnsInPage } = selectReaderSetting(this.getState());

    const contentFormat = selectReaderContentFormat(this.getState());
    const calculatedWidth = screenWidth() - (this.getContainerHorizontalMargin() * 2);
    if (contentFormat === ContentFormat.HTML) {
      const width = (columnsInPage > 1) ? calculatedWidth : Math.min(calculatedWidth, this.getMaxWidth());
      return `${(width - (this.getColumnGap() * (columnsInPage - 1))) / columnsInPage}px`;
    }
    return withUnit ? `${calculatedWidth / columnsInPage}px` : calculatedWidth / columnsInPage;
  }

  getContentFooterHeight(withUnit = false) {
    const { contentFooterHeight } = selectReaderSetting(this.getState());
    return withUnit ? `${contentFooterHeight}px` : contentFooterHeight;
  }

  getChapterIndicatorId(chapterNum) {
    return `${CHAPTER_INDICATOR_ID_PREFIX}${chapterNum}`;
  }

  getChapterId(chapterNum) {
    return `${CHAPTER_ID_PREFIX}${chapterNum}`;
  }

  getStyledTouchable() {
    const contentFormat = selectReaderContentFormat(this.getState());
    const { viewType } = selectReaderSetting(this.getState());
    if (contentFormat === ContentFormat.HTML && viewType === ViewType.SCROLL) {
      return StyledHtmlScrollTouchable;
    } else if (contentFormat === ContentFormat.HTML && viewType === ViewType.PAGE) {
      return StyledHtmlPageTouchable;
    } else if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.SCROLL) {
      return StyledImageScrollTouchable;
    } else if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.PAGE) {
      return StyledImagePageTouchable;
    }
    return null;
  }

  getStyledContent() {
    const contentFormat = selectReaderContentFormat(this.getState());
    const { viewType } = selectReaderSetting(this.getState());
    if (contentFormat === ContentFormat.HTML && viewType === ViewType.SCROLL) {
      return StyledHtmlScrollContent;
    } else if (contentFormat === ContentFormat.HTML && viewType === ViewType.PAGE) {
      return StyledHtmlPageContent;
    } else if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.SCROLL) {
      return StyledImageScrollContent;
    } else if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.PAGE) {
      return StyledImagePageContent;
    }
    return null;
  }

  getStyledFooter() {
    const { viewType } = selectReaderSetting(this.getState());
    if (viewType === ViewType.SCROLL) {
      return StyledScrollFooter;
    } else if (viewType === ViewType.PAGE) {
      return StyledPageFooter;
    }
    return null;
  }

  updateSetting(setting) {
    this.dispatch(updateSetting(setting));
    if (Object.keys(setting).some(s => settingsAffectingCalculation.includes(s))) {
      CalculationsConnector.invalidate();
    }
  }
}

export default new SettingConnector();

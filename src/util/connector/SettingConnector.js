import Connector from '../Connector';
import { screenHeight, screenWidth } from '../BrowserWrapper';
import {
  CHAPTER_INDICATOR_ID_PREFIX,
  CHAPTER_ID_PREFIX,
  DEFAULT_FONT,
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
  'fontSizeInPx',
  'contentPaddingInPercent',
  'contentWidthInPercent',
  'lineHeightInEm',
  'columnsInPage',
  'columnGapInPercent',
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

  getContainerWidthInternal() {
    const contentFormat = selectReaderContentFormat(this.getState());
    const {
      containerHorizontalMargin,
      viewType,
      contentPaddingInPercent,
    } = selectReaderSetting(this.getState());

    const width = screenWidth();
    const containerWidth = width - (containerHorizontalMargin * 2);

    if (contentFormat === ContentFormat.HTML) {
      const extendedMargin = Math.ceil(containerWidth * (contentPaddingInPercent / 100));
      return width - (extendedMargin * 2);
    }
    if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.SCROLL) {
      return containerWidth;
    }
    if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.PAGE) {
      return width;
    }
    return null;
  }

  getContainerWidth(withUnit = false) {
    const result = this.getContainerWidthInternal();
    if (result !== null) {
      return withUnit ? `${result}px` : result;
    }
    return 'auto';
  }

  getContainerHeight(withUnit = false) {
    const contentFormat = selectReaderContentFormat(this.getState());
    const { viewType } = selectReaderSetting(this.getState());

    const height = screenHeight();

    if (contentFormat === ContentFormat.HTML && viewType === ViewType.PAGE) {
      const result = height - (this.getContainerVerticalMargin() * 2);
      return withUnit ? `${result}px` : result;
    }
    if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.PAGE) {
      return withUnit ? `${height}px` : height;
    }
    return 'auto';
  }

  getContentWidth(index, withUnit = false) {
    const { viewType, contentWidthInPercent } = selectReaderSetting(this.getState());
    const contentFormat = selectReaderContentFormat(this.getState());

    if (contentFormat === ContentFormat.HTML) {
      if (viewType === ViewType.SCROLL) {
        return withUnit ? '100%' : 100;
      }
      if (viewType === ViewType.PAGE) {
        if (CalculationsConnector.isCalculated(index)) {
          const total = CalculationsConnector.getTotal(index);
          const fullWidth = (this.getContainerWidthInternal() * total) + (this.getColumnGap() * (total - 1));
          return withUnit ? `${fullWidth}px` : fullWidth;
        }
        return 'auto';
      }
    }
    return withUnit ? `${contentWidthInPercent}%` : contentWidthInPercent;
  }

  getFont() {
    const { font } = selectReaderSetting(this.getState());
    return font || DEFAULT_FONT;
  }

  getFontSize(withUnit = false) {
    const { fontSizeInPx } = selectReaderSetting(this.getState());
    return withUnit ? `${fontSizeInPx}px` : fontSizeInPx;
  }

  getLineHeight(withUnit = false) {
    const { lineHeightInEm } = selectReaderSetting(this.getState());
    return withUnit ? `${lineHeightInEm}em` : lineHeightInEm;
  }

  getColumnGap(withUnit = false) {
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.HTML) {
      const { columnGapInPercent } = selectReaderSetting(this.getState());
      const columnGap = Math.ceil(screenWidth() * (columnGapInPercent / 100));
      return withUnit ? `${columnGap}px` : columnGap;
    }
    return withUnit ? '0px' : 0;
  }

  getContainerVerticalMargin(withUnit = false) {
    const { containerVerticalMargin } = selectReaderSetting(this.getState());
    return withUnit ? `${containerVerticalMargin}px` : containerVerticalMargin;
  }

  /**
   * `containerHorizontalMargin` 설정에 의해 계산된 콘텐츠 영역 좌우 마진 값
   * @param withUnit
   * @returns {number|string}
   */
  getContainerHorizontalMargin(withUnit = false) {
    const containerWidth = this.getContainerWidthInternal();
    const result = (screenWidth() - containerWidth) / 2;
    return withUnit ? `${result}px` : result;
  }

  getColumnWidth(withUnit = false) {
    const { columnsInPage } = selectReaderSetting(this.getState());

    const contentFormat = selectReaderContentFormat(this.getState());
    const calculatedWidth = this.getContainerWidthInternal();
    if (contentFormat === ContentFormat.HTML) {
      return `${(calculatedWidth - (this.getColumnGap() * (columnsInPage - 1))) / columnsInPage}px`;
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

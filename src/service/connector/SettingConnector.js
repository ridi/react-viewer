import BaseConnector from './BaseConnector';
import { screenHeight, screenWidth } from '../../util/BrowserWrapper';
import {
  CHAPTER_INDICATOR_ID_PREFIX,
  CHAPTER_ID_PREFIX,
  DEFAULT_FONT,
} from '../../constants/StyledConstants';
import { ContentFormat } from '../../constants/ContentConstants';
import { ViewType } from '../../constants/SettingConstants';
import { selectReaderContentFormat, selectReaderSetting } from '../../redux/selector';
import { updateSetting } from '../../redux/action';
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

class SettingConnector extends BaseConnector {
  getMaxWidth(withUnit = false) {
    const { maxWidth } = this.getSetting();
    return withUnit ? `${maxWidth}px` : maxWidth;
  }

  getContainerWidthInternal() {
    const contentFormat = selectReaderContentFormat(this.getState());
    const {
      containerHorizontalMargin,
      viewType,
      contentPaddingInPercent,
    } = this.getSetting();

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
    const { viewType } = this.getSetting();

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
    const { viewType, contentWidthInPercent } = this.getSetting();
    const contentFormat = selectReaderContentFormat(this.getState());

    if (contentFormat === ContentFormat.HTML) {
      if (viewType === ViewType.SCROLL) {
        return withUnit ? '100%' : 100;
      }
      if (viewType === ViewType.PAGE) {
        if (CalculationsConnector.isContentCalculated(index)) {
          const total = CalculationsConnector.getContentTotal(index);
          const fullWidth = (this.getContainerWidthInternal() * total) + (this.getColumnGap() * (total - 1));
          return withUnit ? `${fullWidth}px` : fullWidth;
        }
        return 'auto';
      }
    }
    return withUnit ? `${contentWidthInPercent}%` : contentWidthInPercent;
  }

  getFont() {
    const { font } = this.getSetting();
    return font || DEFAULT_FONT;
  }

  getFontSize(withUnit = false) {
    const { fontSizeInPx } = this.getSetting();
    return withUnit ? `${fontSizeInPx}px` : fontSizeInPx;
  }

  getLineHeight(withUnit = false) {
    const { lineHeightInEm } = this.getSetting();
    return withUnit ? `${lineHeightInEm}em` : lineHeightInEm;
  }

  getColumnGap(withUnit = false) {
    const contentFormat = selectReaderContentFormat(this.getState());
    if (contentFormat === ContentFormat.HTML) {
      const { columnGapInPercent } = this.getSetting();
      const columnGap = Math.ceil(screenWidth() * (columnGapInPercent / 100));
      return withUnit ? `${columnGap}px` : columnGap;
    }
    return withUnit ? '0px' : 0;
  }

  getContainerVerticalMargin(withUnit = false) {
    const { containerVerticalMargin } = this.getSetting();
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
    const { columnsInPage } = this.getSetting();

    const contentFormat = selectReaderContentFormat(this.getState());
    const calculatedWidth = this.getContainerWidthInternal();
    if (contentFormat === ContentFormat.HTML) {
      return `${(calculatedWidth - (this.getColumnGap() * (columnsInPage - 1))) / columnsInPage}px`;
    }
    return withUnit ? `${calculatedWidth / columnsInPage}px` : calculatedWidth / columnsInPage;
  }

  getContentFooterHeight(withUnit = false) {
    const { contentFooterHeight } = this.getSetting();
    return withUnit ? `${contentFooterHeight}px` : contentFooterHeight;
  }

  getScrollingContentGap(withUnit = false) {
    return withUnit ? '50px' : 50;
  }

  getChapterIndicatorId(chapterNum) {
    return `${CHAPTER_INDICATOR_ID_PREFIX}${chapterNum}`;
  }

  getChapterId(chapterNum) {
    return `${CHAPTER_ID_PREFIX}${chapterNum}`;
  }

  getSetting() {
    return selectReaderSetting(this.getState());
  }

  updateSetting(setting) {
    this.dispatch(updateSetting(setting));
    if (Object.keys(setting).some(s => settingsAffectingCalculation.includes(s))) {
      CalculationsConnector.invalidate();
    }
  }
}

export default new SettingConnector();

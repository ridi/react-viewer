import {
  getClientHeight,
  getScrollHeight,
  getScrollLeft,
  getScrollTop,
  getScrollWidth,
  measure,
  setScrollLeft,
  setScrollTop,
} from './util';
import Events, { SET_CONTENT } from './Events';
import ReaderJsHelper from './ReaderJsHelper';
import {
  PagingAction,
  PagingActionType,
  SettingAction,
  SettingActionType,
  SettingState,
  StatusAction,
  StatusActionType,
} from './contexts';
import * as React from 'react';

export interface FontData {
  href: string,
}

export interface EpubParsedData {
  fonts?: Array<FontData>,
  styles?: Array<String>,
  spines?: Array<String>,
  unzipPath: string,
}

export interface PagingResult {
  totalPage: number,
  pageUnit: number,
  fullHeight: number,
  fullWidth: number,
}

export class EpubService {
  static dispatchSetting?: React.Dispatch<SettingAction>;
  static dispatchStatus?: React.Dispatch<StatusAction>;
  static dispatchPaging?: React.Dispatch<PagingAction>;

  static init({ dispatchSetting, dispatchPaging, dispatchStatus }: {
    dispatchSetting: React.Dispatch<SettingAction>,
    dispatchStatus: React.Dispatch<StatusAction>,
    dispatchPaging: React.Dispatch<PagingAction>,
  }) {
    EpubService.dispatchStatus = dispatchStatus;
    EpubService.dispatchSetting = dispatchSetting;
    EpubService.dispatchPaging = dispatchPaging;
  }

  private static setStartToRead = async (startToRead: boolean) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!EpubService.dispatchStatus) return resolve();
        EpubService.dispatchStatus({ type: StatusActionType.SET_START_TO_READ, startToRead });
        console.log(`startToRead => ${startToRead}`);
        resolve();
      }, 0);
    });
  };

  private static inLoadingState = async (run: () => any) => {
    await EpubService.setStartToRead(false);
    const result = await run();
    await EpubService.setStartToRead(true);
    return result;
  };

  private static appendStyles = async ({ metadata }: { metadata: EpubParsedData }): Promise<void> => {
    return measure(() => {
      if (!metadata.styles) return;
      const element = document.createElement('style');
      element.innerText = metadata.styles.join(' ');
      document.head.appendChild(element);
    }, 'Added Styles');
  };

  private static waitImagesLoaded = async (): Promise<void> => {
    const imageCount = document.images.length;
    return measure(() => new Promise((onImagesLoaded) => {
      let count = 0;
      const tap = () => {
        count += 1;
        if (count === imageCount) {
          onImagesLoaded();
        }
      };
      Array.from(document.images).forEach((image) => {
        if (image.complete) {
          tap();
        } else {
          image.addEventListener('load', tap);
          image.addEventListener('error', tap);
        }
      });
    }), `${imageCount} images loaded`);
  };

  private static prepareFonts = async ({ metadata }: { metadata: EpubParsedData }): Promise<void> => {
    if (!metadata.fonts) return Promise.resolve();
    const fontFaces = metadata.fonts.map(font => font.href).map((href) => {
      const name = href.split('/').slice(-1)[0].replace(/\./g, '_');
      return new FontFace(name, `url("${metadata.unzipPath}/${href}")`);
    });

    return measure(
      () => Promise.all(
        fontFaces.map(fontFace => fontFace.load()
          .then(() => (document as any).fonts.add(fontFace))
          .catch((error) => console.warn('font loading error: ', error)),
        )), `${metadata.fonts.length} fonts loaded`);
  };

  private static startPaging = async ({
    isScroll,
    columnGap,
    columnWidth,
    columnsInPage,
  }: {
    isScroll: boolean,
    columnGap: number,
    columnWidth: number,
    columnsInPage: number,
  }): Promise<PagingResult> => {
    return measure(() => {
      if (!EpubService.dispatchPaging) return;
      const paging: PagingResult = {
        totalPage: 0,
        pageUnit: 0,
        fullHeight: 0,
        fullWidth: 0,
      };
      if (isScroll) {
        paging.pageUnit = getClientHeight();
        paging.fullHeight = getScrollHeight();
        // 어차피 스크롤보기에서 마지막 페이지에 도달하는 것은 거의 불가능하므로, Math.floor로 계산
        paging.totalPage = Math.floor(paging.fullHeight / paging.pageUnit);
      } else {
        paging.pageUnit = columnWidth + columnGap;
        paging.fullWidth = getScrollWidth();
        paging.totalPage = Math.ceil(paging.fullWidth / paging.pageUnit) * columnsInPage;
      }

      EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging });
      console.log('paging =>', paging);
      return paging;
    }, 'Paging done');
  };

  private static restoreCurrent = async ({
    page,
    pageUnit,
    isScroll,
    columnsInPage,
  }: {
    page: number,
    pageUnit: number,
    isScroll: boolean,
    columnsInPage: number,
  }): Promise<void> => {
    return measure(() => EpubService.goToPage({
      page,
      pageUnit,
      isScroll,
      columnsInPage,
    }), `Restore current page => ${page}`);
  };

  static goToPage = async ({
    page,
    pageUnit,
    isScroll,
    columnsInPage,
  }: {
    page: number,
    pageUnit: number,
    isScroll: boolean,
    columnsInPage: number,
  }): Promise<void> => {
    return measure(async () => {
      if (!EpubService.dispatchPaging) return;
      if (isScroll) {
        setScrollLeft(0);
        setScrollTop((page - 1) * pageUnit);
      } else {
        setScrollLeft(Math.floor((page - 1) / columnsInPage) * pageUnit);
        setScrollTop(0);
        console.log(`scrollLeft => ${Math.floor((page - 1) / columnsInPage) * pageUnit}`);
      }
      EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging: { currentPage: page } });
    }, `Go to page => ${page} (${(page - 1) * pageUnit})`);
  };

  static invalidate = async ({
    currentPage,
    isScroll,
    columnWidth,
    columnGap,
    columnsInPage,
  }: {
    currentPage: number,
    isScroll: boolean,
    columnWidth: number,
    columnGap: number,
    columnsInPage: number,
  }): Promise<void> => {
    const _invalidate = async () => {
      try {
        await EpubService.waitImagesLoaded();
        await ReaderJsHelper.reviseImages();
        const { pageUnit } = await EpubService.startPaging({ isScroll, columnWidth, columnGap, columnsInPage });
        await EpubService.restoreCurrent({ page: currentPage, pageUnit, isScroll, columnsInPage });
      } catch (e) {
        console.error(e);
      }
    };
    return EpubService.inLoadingState(_invalidate);
  };

  static load = async ({
    metadata,
    currentPage,
    isScroll,
    columnWidth,
    columnGap,
    columnsInPage,
  }: {
    metadata: EpubParsedData,
    currentPage: number,
    isScroll: boolean,
    columnWidth: number,
    columnGap: number,
    columnsInPage: number,
  }): Promise<void> => {
    return EpubService.inLoadingState(async () => {
      await EpubService.appendStyles({ metadata });
      await EpubService.prepareFonts({ metadata });
      Events.emit(SET_CONTENT, metadata.spines);
      await EpubService.invalidate({ currentPage, isScroll, columnWidth, columnGap, columnsInPage });
    });
  };

  static loadWithParsedData = EpubService.load;

  static updateCurrent = async ({ pageUnit, isScroll, columnsInPage }: { pageUnit: number, isScroll: boolean, columnsInPage: number }) => {
    return measure(() => {
      if (!EpubService.dispatchPaging) return;
      let currentPage;
      if (isScroll) {
        currentPage = Math.floor(getScrollTop() / pageUnit) + 1;
      } else {
        currentPage = (Math.floor(getScrollLeft() / pageUnit) * columnsInPage) + 1;
      }
      EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging: { currentPage } });
    }, 'update current page').catch(error => console.error(error));
  };

  static updateSetting = (setting: Partial<SettingState>) => {
    if (!EpubService.dispatchSetting) return;
    EpubService.dispatchSetting({ type: SettingActionType.UPDATE_SETTING, setting });
  };
}

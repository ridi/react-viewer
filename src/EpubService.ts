import {
  getClientHeight,
  getContentRootElement,
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
  PagingState,
  SettingAction,
  SettingActionType,
  SettingState, SpinePagingState,
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
  }: {
    isScroll: boolean,
    columnGap: number,
    columnWidth: number,
  }): Promise<Pick<PagingState, 'totalPage' | 'pageUnit' | 'fullHeight' | 'fullWidth' | 'spines'>> => {
    return measure(() => {
      if (!EpubService.dispatchPaging) return;
      const paging: Pick<PagingState, 'totalPage' | 'pageUnit' | 'fullHeight' | 'fullWidth' | 'spines'> = {
        totalPage: 0,
        pageUnit: 0,
        fullHeight: 0,
        fullWidth: 0,
        spines: [],
      };
      const contentRoot = getContentRootElement();
      const spines = contentRoot ? Array.from(contentRoot.getElementsByTagName('article')) : [];
      if (isScroll) {
        paging.pageUnit = getClientHeight();
        paging.fullHeight = getScrollHeight();
        // 어차피 스크롤보기에서 마지막 페이지에 도달하는 것은 거의 불가능하므로, Math.floor로 계산
        paging.totalPage = Math.floor(paging.fullHeight / paging.pageUnit);
        spines.reduce((offset, { scrollHeight }, index) => {
          paging.spines.push({ spineIndex: index + 1, offset, total: scrollHeight });
          return offset + scrollHeight;
        }, 0);
      } else {
        paging.pageUnit = columnWidth + columnGap;
        paging.fullWidth = getScrollWidth();
        paging.totalPage = Math.ceil(paging.fullWidth / paging.pageUnit);

        const defaultOffset = contentRoot ? contentRoot.offsetLeft : 0;
        const offset = spines.reduce((offset, { offsetLeft }, index) => {
          if (index > 0) {
            paging.spines.push({ spineIndex: index, offset: offset - defaultOffset, total: offsetLeft - offset });
          }
          return offsetLeft;
        }, 0);
        paging.spines.push({ spineIndex: spines.length, offset: offset - defaultOffset, total: paging.fullWidth - offset});
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
  }: {
    page: number,
    pageUnit: number,
    isScroll: boolean,
  }): Promise<void> => {
    return measure(async () => {
      return EpubService.goToPage({
        page,
        pageUnit,
        isScroll,
      });
    }, `Restore current page => ${page}`);
  };

  static goToPage = async ({
    page,
    pageUnit,
    isScroll,
  }: {
    page: number,
    pageUnit: number,
    isScroll: boolean,
  }): Promise<void> => {
    return measure(async () => {
      if (!EpubService.dispatchPaging) return;
      if (isScroll) {
        setScrollLeft(0);
        setScrollTop((page - 1) * pageUnit);
      } else {
        setScrollLeft((page - 1) * pageUnit);
        setScrollTop(0);
        console.log(`scrollLeft => ${(page - 1) * pageUnit}`);
      }
      EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging: { currentPage: page } });
    }, `Go to page => ${page} (${(page - 1) * pageUnit})`);
  };

  static invalidate = async ({
    currentPage,
    isScroll,
    columnWidth,
    columnGap,
  }: {
    currentPage: number,
    isScroll: boolean,
    columnWidth: number,
    columnGap: number,
  }): Promise<void> => {
    const _invalidate = async () => {
      try {
        await EpubService.waitImagesLoaded();
        await ReaderJsHelper.reviseImages();
        const { pageUnit } = await EpubService.startPaging({ isScroll, columnWidth, columnGap });
        await EpubService.restoreCurrent({ page: currentPage, pageUnit, isScroll });
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
  }: {
    metadata: EpubParsedData,
    currentPage: number,
    isScroll: boolean,
    columnWidth: number,
    columnGap: number,
  }): Promise<void> => {
    return EpubService.inLoadingState(async () => {
      await EpubService.appendStyles({ metadata });
      await EpubService.prepareFonts({ metadata });
      Events.emit(SET_CONTENT, metadata.spines);
      await EpubService.invalidate({ currentPage, isScroll, columnWidth, columnGap });
    });
  };

  static loadWithParsedData = EpubService.load;

  static updateCurrent = async ({
    pageUnit, isScroll, spines,
  }: {
    pageUnit: number, isScroll: boolean, spines: Array<SpinePagingState>,
  }) => {
    return measure(() => {
      if (!EpubService.dispatchPaging) return;
      let currentPage, currentSpineIndex = 1, currentPosition = 0;
      if (isScroll) {
        const scrollTop = getScrollTop();
        currentPage = Math.floor(scrollTop / pageUnit) + 1;
        const result = spines.find(({ offset, total }) => scrollTop >= offset && scrollTop < offset + total);
        if (result) {
          currentSpineIndex = result.spineIndex;
          currentPosition = (scrollTop - result.offset) / result.total;
        }
      } else {
        const scrollLeft = getScrollLeft();
        currentPage = Math.floor(scrollLeft / pageUnit) + 1;
        const result = spines.find(({ offset, total }) => scrollLeft >= offset && scrollLeft < offset + total);
        if (result) {
          currentSpineIndex = result.spineIndex;
          currentPosition = (scrollLeft - result.offset) / result.total;
        }
      }
      EpubService.dispatchPaging({
        type: PagingActionType.UPDATE_PAGING,
        paging: { currentPage, currentSpineIndex, currentPosition },
      });
    }, 'update current page').catch(error => console.error(error));
  };

  static updateSetting = (setting: Partial<SettingState>) => {
    if (!EpubService.dispatchSetting) return;
    EpubService.dispatchSetting({ type: SettingActionType.UPDATE_SETTING, setting });
  };
}

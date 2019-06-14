import axios from 'axios';
import {getClientHeight, getClientWidth, getScrollHeight, getScrollWidth, measure} from './util';
import Events, {SET_CONTENT} from './Events';
import ReaderJsHelper from './ReaderJsHelper';
import {
  PagingAction,
  PagingActionType,
  SettingAction,
  StatusAction,
  StatusActionType,
} from "./contexts";
import * as React from "react";

interface FontData {
  href: string,
}

interface EpubParsedData {
  fonts?: Array<FontData>,
  styles?: Array<String>,
  spines?: Array<String>,
  unzipPath: string,
}

interface PagingResult {
  totalPage: number,
  pageUnit: number,
  fullHeight: number,
  fullWidth: number,
}

export default class EpubService {
  static dispatchSetting?: React.Dispatch<SettingAction>;
  static dispatchStatus?: React.Dispatch<StatusAction>;
  static dispatchPaging?: React.Dispatch<PagingAction>;

  static init(dispatchSetting: React.Dispatch<SettingAction>, dispatchStatus: React.Dispatch<StatusAction>, dispatchPaging: React.Dispatch<PagingAction>) {
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

  private static appendStyles = async (metadata: EpubParsedData): Promise<void> => {
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

  private static prepareFonts = async (metadata: EpubParsedData): Promise<void> => {
    if (!metadata.fonts) return Promise.resolve();
    const fontFaces = metadata.fonts.map(font => font.href).map((href) => {
      const name = href.split('/').slice(-1)[0].replace(/\./g, '_');
      return new FontFace(name, `url("${metadata.unzipPath}/${href}")`);
    });

    return measure(() => Promise.all(fontFaces.map(fontFace => fontFace.load())).then(() => {
      fontFaces.forEach(f => (document as any).fonts.add(f));
    }), `${metadata.fonts.length} fonts loaded`);
  };

  private static startPaging = async (isScroll: boolean, columnGap: number): Promise<PagingResult> => {
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
        // 어차피 스크롤보기에서 마지막 페이지에 도달하는 것은 불가능하므로, Math.floor로 계산
        paging.totalPage = Math.floor(paging.fullHeight / paging.pageUnit);
      } else {
        paging.pageUnit = getClientWidth() + columnGap;
        paging.fullWidth = getScrollWidth();
        paging.totalPage = Math.ceil(paging.fullWidth / paging.pageUnit);
      }

      EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging });
      console.log('paging =>', paging);
      return paging;
    }, 'Paging done');
  };

  static goToPage = async (page: number, pageUnit: number, isScroll: boolean): Promise<void> => {
    return measure(async () => {
      if (!EpubService.dispatchPaging) return;
      if (isScroll) {
        document.documentElement.scrollLeft = 0;
        document.documentElement.scrollTop = (page - 1) * pageUnit;
      } else {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = (page - 1) * pageUnit;
      }
      EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging: { currentPage: page } });
    }, `Go to page => ${page} (${(page - 1) * pageUnit})`);
  };

  private static restoreCurrent = async (page: number, pageUnit: number, isScroll: boolean): Promise<void> => {
    return measure(() => EpubService.goToPage(page, pageUnit, isScroll), `Restore current page => ${page}`);
  };

  static invalidate = async (currentPage: number, isScroll: boolean, columnGap: number): Promise<void> => {
    const _invalidate = async () => {
      try {
        await EpubService.waitImagesLoaded();
        await ReaderJsHelper.reviseImages();
        const { pageUnit } = await EpubService.startPaging(isScroll, columnGap);
        await EpubService.restoreCurrent(currentPage, pageUnit, isScroll);
      } catch (e) {
        console.error(e);
      }
    };
    return EpubService.inLoadingState(_invalidate);
  };

  private static parseBook = async (file: File): Promise<EpubParsedData> => {
    return new Promise((resolve, reject) => {
      axios.get(`/api/book?filename=${encodeURI(file.name)}`).then((response) => {
        return resolve(response.data);
      }).catch((error) => {
        if (error.response.status === 404) {
          const formData = new FormData();
          formData.append('file', file);
          return axios.post('/api/book/upload', formData).then(response => resolve(response.data));
        }
        reject(error);
      });
    });
  };

  static load = async (file: File, currentPage: number, isScroll: boolean, columnGap: number): Promise<void> => {
    return EpubService.inLoadingState(async () => {
      try {
        const metadata = await EpubService.parseBook(file);
        await EpubService.appendStyles(metadata);
        await EpubService.prepareFonts(metadata);
        Events.emit(SET_CONTENT, metadata.spines);
        await EpubService.invalidate(currentPage, isScroll, columnGap);
      } catch (e) {
        console.error(e);
      }
    });
  };

  static loadWithParsedData = async (metadata: EpubParsedData, currentPage: number, isScroll: boolean, columnGap: number): Promise<void> => {
    return EpubService.inLoadingState(async () => {
      try {
        await EpubService.appendStyles(metadata);
        await EpubService.prepareFonts(metadata);
        Events.emit(SET_CONTENT, metadata.spines);
        await EpubService.invalidate(currentPage, isScroll, columnGap);
      } catch (e) {
        console.error(e);
      }
    });
  };


  static updateCurrent = async (pageUnit: number, isScroll: boolean) => {
    return measure(() => {
      if (!EpubService.dispatchPaging) return;
      if (isScroll) {
        const { scrollTop } = document.documentElement;
        EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging: { currentPage: Math.floor(scrollTop / pageUnit) + 1 } });
      } else {
        const { scrollLeft } = document.documentElement;
        EpubService.dispatchPaging({ type: PagingActionType.UPDATE_PAGING, paging: { currentPage: Math.floor(scrollLeft / pageUnit) + 1 } });
      }
    }, 'update current page');
  };

}


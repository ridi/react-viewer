import Events, { SET_CONTENT } from './Events';
import * as React from 'react';
import {
  ComicPagingAction,
  ComicPagingActionType,
  ComicPagingState,
  ComicSettingAction, ComicSettingActionType,
  ComicSettingState,
  ComicStatusAction,
  ComicStatusActionType,
} from './contexts';
import { getClientWidth, measure, setScrollLeft, setScrollTop } from './utils/Util';
import { contentWidth, isScroll } from './utils/ComicSettingUtil';

export interface ImageData {
  fileSize: number,
  index: number, // 0-based
  path: string,
  width?: number,
  height?: number,
}

export interface ComicParsedData {
  type: 'comic',
  images?: Array<ImageData>,
  unzipPath: string,
}

export class ComicService {
  static dispatchSetting?: React.Dispatch<ComicSettingAction>;
  static dispatchStatus?: React.Dispatch<ComicStatusAction>;
  static dispatchPaging?: React.Dispatch<ComicPagingAction>;

  private static setReadyToRead = async (readyToRead: boolean) => {
    return new Promise((resolve) => {
      if (!ComicService.dispatchStatus) return resolve();
      ComicService.dispatchStatus({ type: ComicStatusActionType.SET_READY_TO_READ, readyToRead });
      setTimeout(() => {
        console.log(`readyToRead => ${readyToRead}`);
        resolve();
      }, 0);
    });
  };

  private static restoreCurrent = async ({
    pagingState,
    settingState,
  }: {
    pagingState: ComicPagingState,
    settingState: ComicSettingState,
  }) => {
    await ComicService.goToPage({
      page: pagingState.currentPage,
      settingState,
      pagingState
    });
  };

  private static startPaging = async ({
    pagingState,
    settingState,
  }: {
    pagingState: ComicPagingState,
    settingState: ComicSettingState,
  }): Promise<ComicPagingState> => {
    if (!ComicService.dispatchPaging) return pagingState;
    if (isScroll(settingState)) {
      // update images[].offset, height
      const width = contentWidth(settingState);
      let offsetTop = 0;
      const images = pagingState.images.map((image) => {
        const height = width * image.ratio;
        const result = { ...image, height, offsetTop };
        offsetTop += height;
        return result;
      });
      ComicService.dispatchPaging({ type: ComicPagingActionType.UPDATE_PAGING, paging: { images }});
      return { ...pagingState, images };
    } else {
      // update pageUnit
      const pageUnit = getClientWidth();
      ComicService.dispatchPaging({ type: ComicPagingActionType.UPDATE_PAGING, paging: { pageUnit }});
      return { ...pagingState, pageUnit };
    }
  };

  static init = ({ dispatchSetting, dispatchPaging, dispatchStatus }: {
    dispatchSetting: React.Dispatch<ComicSettingAction>,
    dispatchStatus: React.Dispatch<ComicStatusAction>,
    dispatchPaging: React.Dispatch<ComicPagingAction>,
  }) => {
    ComicService.dispatchStatus = dispatchStatus;
    ComicService.dispatchSetting = dispatchSetting;
    ComicService.dispatchPaging = dispatchPaging;
  };

  static invalidate = async ({
    pagingState,
    settingState,
  }: {
    pagingState: ComicPagingState,
    settingState: ComicSettingState,
  }) => {
    await ComicService.setReadyToRead(false);
    const newPagingState = await ComicService.startPaging({ pagingState, settingState });
    await ComicService.restoreCurrent({ pagingState: newPagingState, settingState });
    await ComicService.setReadyToRead(true);
  };

  static load = async ({
    metadata,
    pagingState,
    settingState,
  }: {
    metadata: ComicParsedData,
    pagingState: ComicPagingState,
    settingState: ComicSettingState,
  }) => {
    if (!ComicService.dispatchPaging) return;
    if (!metadata.images) return;
    await ComicService.setReadyToRead(false);
    const paging = {
      ...pagingState,
      totalPage: metadata.images ? metadata.images.length : 0,
      images: metadata.images.map((image) => {
        return {
          imageIndex: image.index + 1,
          offsetTop: 0,
          ratio: (image.height && image.width) ? image.height / image.width : 1.4,
          height: 0,
        };
      }),
    };
    ComicService.dispatchPaging({ type: ComicPagingActionType.UPDATE_PAGING, paging });
    Events.emit(SET_CONTENT, metadata.images);
    await ComicService.invalidate({ pagingState: paging, settingState });
    await ComicService.setReadyToRead(true);
  };

  static goToPage = async ({
    page,
    settingState,
    pagingState,
  }: {
    page: number,
    settingState: ComicSettingState,
    pagingState: ComicPagingState,
  }): Promise<void> => {
    return measure(async () => {
      if (!ComicService.dispatchPaging) return;
      if (isScroll(settingState)) {
        setScrollLeft(0);
        setScrollTop(pagingState.images[page - 1].offsetTop);
        console.log(`- scrollTop => ${pagingState.images[page - 1].offsetTop}`);
      } else {
        // todo 2페이지 보기인 경우 짝수 페이지에 도달할 수 없도록 처리 필요
        setScrollLeft((page - 1) * pagingState.pageUnit);
        setScrollTop(0);
        console.log(`- scrollLeft => ${(page - 1) * pagingState.pageUnit}`);
      }
      ComicService.dispatchPaging({ type: ComicPagingActionType.UPDATE_PAGING, paging: { currentPage: page } });
    }, `Go to page => ${page}`);
  };

  static updateSetting = async (setting: Partial<ComicSettingState>) => {
    if (!ComicService.dispatchSetting) return;
    await ComicService.setReadyToRead(false);
    ComicService.dispatchSetting({ type: ComicSettingActionType.UPDATE_SETTING, setting });
  };
}

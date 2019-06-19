import Events, { SET_CONTENT } from './Events';
import * as React from 'react';
import {
  ComicCalculationAction,
  ComicCalculationActionType,
  ComicCalculationState,
  ComicCurrentAction,
  ComicCurrentActionType,
  ComicCurrentState,
  ComicSettingAction,
  ComicSettingActionType,
  ComicSettingState,
  ComicStatusAction,
  ComicStatusActionType,
  ComicStatusState,
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

interface ComicServiceProperties {
  dispatchSetting: React.Dispatch<ComicSettingAction>,
  dispatchStatus: React.Dispatch<ComicStatusAction>,
  dispatchCalculation: React.Dispatch<ComicCalculationAction>,
  dispatchCurrent: React.Dispatch<ComicCurrentAction>,
  settingState: ComicSettingState,
  statusState: ComicStatusState,
  currentState: ComicCurrentState,
  calculationState: ComicCalculationState,
}

export class ComicService {
  private static instance: ComicService;

  dispatchSetting: React.Dispatch<ComicSettingAction>;
  dispatchStatus: React.Dispatch<ComicStatusAction>;
  dispatchCalculation: React.Dispatch<ComicCalculationAction>;
  dispatchCurrent: React.Dispatch<ComicCurrentAction>;

  settingState: ComicSettingState;
  currentState: ComicCurrentState;
  statusState: ComicStatusState;
  calculationState: ComicCalculationState;

  static init(props: ComicServiceProperties) {
    this.instance = new ComicService(props);
  }

  static get() {
    return this.instance;
  }

  static updateState({
    settingState,
    currentState,
    statusState,
    calculationState,
  }: {
    settingState: ComicSettingState,
    statusState: ComicStatusState,
    currentState: ComicCurrentState,
    calculationState: ComicCalculationState,
  }) {
    this.instance.settingState = settingState;
    this.instance.currentState = currentState;
    this.instance.statusState = statusState;
    this.instance.calculationState = calculationState;
  }

  private constructor({
    dispatchSetting,
    dispatchCalculation,
    dispatchStatus,
    dispatchCurrent,
    settingState,
    currentState,
    statusState,
    calculationState,
  }: ComicServiceProperties) {
    this.dispatchSetting = dispatchSetting;
    this.dispatchCalculation = dispatchCalculation;
    this.dispatchStatus = dispatchStatus;
    this.dispatchCurrent = dispatchCurrent;
    this.settingState = settingState;
    this.currentState = currentState;
    this.statusState = statusState;
    this.calculationState = calculationState;
  }

  private setReadyToRead = async (readyToRead: boolean) => {
    return new Promise((resolve) => {
      this.dispatchStatus({ type: ComicStatusActionType.SET_READY_TO_READ, readyToRead });
      setTimeout(() => {
        console.log(`readyToRead => ${readyToRead}`);
        resolve();
      }, 0);
    });
  };

  private restoreCurrent = async () => {
    await this.goToPage(this.currentState.currentPage);
  };

  private calculate = async (): Promise<ComicCalculationState> => {
    if (!this.dispatchCalculation) return this.calculationState;
    if (isScroll(this.settingState)) {
      // update images[].offset, height
      const width = contentWidth(this.settingState);
      let offsetTop = 0;
      const images = this.calculationState.images.map((image) => {
        const height = width * image.ratio;
        const result = { ...image, height, offsetTop };
        offsetTop += height;
        return result;
      });
      this.dispatchCalculation({ type: ComicCalculationActionType.UPDATE_CALCULATION, calculation: { images } });
      return { ...this.calculationState, images };
    } else {
      // update pageUnit
      const pageUnit = getClientWidth();
      this.dispatchCalculation({ type: ComicCalculationActionType.UPDATE_CALCULATION, calculation: { pageUnit } });
      return { ...this.calculationState, pageUnit };
    }
  };

  public invalidate = async () => {
    await this.setReadyToRead(false);
    this.calculationState = await this.calculate();
    await this.restoreCurrent();
    await this.setReadyToRead(true);
  };

  public load = async (metadata: ComicParsedData) => {
    if (!this.dispatchCalculation) return;
    if (!metadata.images) return;
    await this.setReadyToRead(false);
    const initialCalculation = {
      ...this.calculationState,
      totalPage: metadata.images ? metadata.images.length : 0,
      images: metadata.images.map((image) => {
        return {
          imageIndex: image.index,
          offsetTop: 0,
          ratio: (image.height && image.width) ? image.height / image.width : 1.4,
          height: 0,
        };
      }),
    };
    this.dispatchCalculation({
      type: ComicCalculationActionType.UPDATE_CALCULATION,
      calculation: initialCalculation,
    });
    Events.emit(SET_CONTENT, metadata.images);
    await this.invalidate();
    await this.setReadyToRead(true);
  };

  public goToPage = async (page: number): Promise<void> => {
    return measure(async () => {
      if (!this.dispatchCurrent) return;
      if (isScroll(this.settingState)) {
        setScrollLeft(0);
        setScrollTop(this.calculationState.images[page - 1].offsetTop);
        console.log(`- scrollTop => ${this.calculationState.images[page - 1].offsetTop}`);
      } else {
        // todo 2페이지 보기인 경우 짝수 페이지에 도달할 수 없도록 처리 필요
        setScrollLeft((page - 1) * this.calculationState.pageUnit);
        setScrollTop(0);
        console.log(`- scrollLeft => ${(page - 1) * this.calculationState.pageUnit}`);
      }
      this.dispatchCurrent({ type: ComicCurrentActionType.UPDATE_CURRENT, current: { currentPage: page } });
    }, `Go to page => ${page}`);
  };

  public updateSetting = async (setting: Partial<ComicSettingState>) => {
    if (!this.dispatchSetting) return;
    await this.setReadyToRead(false);
    this.dispatchSetting({ type: ComicSettingActionType.UPDATE_SETTING, setting });
  };

  public updateCurrent = async () => {
    // todo implement
  };
}

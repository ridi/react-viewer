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
} from './contexts';
import { getScrollLeft, getScrollTop, measure, setScrollLeft, setScrollTop } from './utils/Util';
import { contentWidth, isScroll, ratio, startWithBlankPage, allowedPageNumber } from './utils/ComicSettingUtil';
import ow from 'ow';
import Validator from './validators';

export interface ImageData {
  fileSize: number,
  index: number, // 0-based
  path: string,
  uri: string,
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
  currentState: ComicCurrentState,
  calculationState: ComicCalculationState,
}

export class ComicService {
  private static instance: ComicService;

  private readonly dispatchSetting: React.Dispatch<ComicSettingAction>;
  private readonly dispatchStatus: React.Dispatch<ComicStatusAction>;
  private readonly dispatchCalculation: React.Dispatch<ComicCalculationAction>;
  private readonly dispatchCurrent: React.Dispatch<ComicCurrentAction>;

  private settingState: ComicSettingState;
  private currentState: ComicCurrentState;
  private calculationState: ComicCalculationState;

  static init(props: ComicServiceProperties) {
    this.instance = new ComicService(props);
  }

  static get() {
    return this.instance;
  }

  static updateState({
    settingState,
    currentState,
    calculationState,
  }: {
    settingState: ComicSettingState,
    currentState: ComicCurrentState,
    calculationState: ComicCalculationState,
  }) {
    this.instance.settingState = settingState;
    this.instance.currentState = currentState;
    this.instance.calculationState = calculationState;
  }

  private constructor({
    dispatchSetting,
    dispatchCalculation,
    dispatchStatus,
    dispatchCurrent,
    settingState,
    currentState,
    calculationState,
  }: ComicServiceProperties) {
    this.dispatchSetting = dispatchSetting;
    this.dispatchCalculation = dispatchCalculation;
    this.dispatchStatus = dispatchStatus;
    this.dispatchCurrent = dispatchCurrent;
    this.settingState = settingState;
    this.currentState = currentState;
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
      const pageUnit = contentWidth(this.settingState);
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

  private initialCalculate = async (metadata: ComicParsedData) => {
    if (!metadata.images) return;

    // init calculation
    const initialCalculation = {
      ...this.calculationState,
      totalPage: metadata.images ? metadata.images.length : 0,
      images: metadata.images.map((image) => {
        return {
          imageIndex: image.index,
          ratio: ratio(image.width, image.height),
          offsetTop: 0,
          height: 0,
        };
      }),
    };
    this.dispatchCalculation({ type: ComicCalculationActionType.UPDATE_CALCULATION, calculation: initialCalculation });
    this.calculationState = initialCalculation;

    // init currentPage
    const initialCurrent = {
      ...this.currentState,
      currentPage: startWithBlankPage(this.settingState) ? 0 : 1,
    };
    this.dispatchCurrent({ type: ComicCurrentActionType.UPDATE_CURRENT, current: initialCurrent });
    this.currentState = initialCurrent;
  };

  public load = async (metadata: ComicParsedData) => {
    ow(metadata, 'ComicService.load(metadata)', Validator.Comic.ComicParsedData);

    if (!this.dispatchCalculation) return;
    if (!metadata.images) return;
    await this.setReadyToRead(false);
    await this.initialCalculate(metadata);
    Events.emit(SET_CONTENT, metadata.images);
    await this.invalidate();
    await this.setReadyToRead(true);
  };

  public goToPage = async (requestPage: number): Promise<void> => {
    ow(requestPage, 'ComicService.goToPage(page)', Validator.Common.Page);

    const page = allowedPageNumber(this.settingState, this.calculationState, requestPage);
    return measure(async () => {
      if (!this.dispatchCurrent) return;
      if (isScroll(this.settingState)) {
        setScrollLeft(0);
        setScrollTop(this.calculationState.images[page - 1].offsetTop); // fixme +1을 해줘야 할 것 같다.
        console.log(`- scrollTop => ${this.calculationState.images[page - 1].offsetTop}`);
      } else {
        // todo 2페이지 보기인 경우 짝수 페이지에 도달할 수 없도록 처리 필요(startWithBlankPage == true인 경우 홀수 페이지에 도달할 수 없어야 함)
        const multiplier = page - (startWithBlankPage(this.settingState) ? 0 : 1);
        setScrollLeft(multiplier * this.calculationState.pageUnit);
        setScrollTop(0);
        console.log(`- scrollLeft => ${multiplier * this.calculationState.pageUnit}`);
      }
      this.dispatchCurrent({ type: ComicCurrentActionType.UPDATE_CURRENT, current: { currentPage: page } });
    }, `Go to page => ${page}`);
  };

  public updateSetting = async (setting: Partial<ComicSettingState>) => {
    ow(setting, 'ComicService.updateSetting(setting)', Validator.Comic.SettingState);

    if (!this.dispatchSetting) return;
    await this.setReadyToRead(false);
    this.dispatchSetting({ type: ComicSettingActionType.UPDATE_SETTING, setting });
  };

  public updateCurrent = async () => {
    return measure(() => {
      const { pageUnit, images } = this.calculationState;
      let currentPage;
      if (isScroll(this.settingState)) {
        const scrollTop = getScrollTop();
        const result = images.find(({ offsetTop, height }) => scrollTop >= offsetTop && scrollTop < offsetTop + height);
        currentPage = result ? result.imageIndex + 1 : 1;
      } else {
        const scrollLeft = getScrollLeft();
        currentPage = Math.floor(scrollLeft / pageUnit) + (startWithBlankPage(this.settingState) ? 0 : 1);
      }
      console.log("update currentState => ", { currentPage });
      this.dispatchCurrent({ type: ComicCurrentActionType.UPDATE_CURRENT, current: { currentPage } });
    }, 'update current page').catch(error => console.error(error));
  };
}

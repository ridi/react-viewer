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
} from './utils/Util';
import Events, { SET_CONTENT } from './Events';
import ReaderJsHelper from './ReaderJsHelper';
import {
  EpubCalculationAction,
  EpubCalculationActionType,
  EpubCalculationState,
  EpubCurrentAction,
  EpubCurrentActionType,
  EpubCurrentState,
  EpubSettingAction,
  EpubSettingActionType,
  EpubSettingState,
  EpubStatusAction,
  EpubStatusActionType,
} from './contexts';
import * as React from 'react';
import { columnGap, columnWidth, isScroll } from './utils/EpubSettingUtil';

export interface FontData {
  href: string,
  uri?: string,
}

export interface EpubParsedData {
  type: 'epub',
  fonts?: Array<FontData>,
  styles?: Array<String>,
  spines?: Array<String>,
  unzipPath: string,
}

interface EpubServiceProperties {
  dispatchSetting: React.Dispatch<EpubSettingAction>,
  dispatchStatus: React.Dispatch<EpubStatusAction>,
  dispatchCalculation: React.Dispatch<EpubCalculationAction>,
  dispatchCurrent: React.Dispatch<EpubCurrentAction>,
  settingState: EpubSettingState,
  currentState: EpubCurrentState,
  calculationState: EpubCalculationState,
}

export class EpubService {
  private static instance: EpubService;

  private readonly dispatchSetting: React.Dispatch<EpubSettingAction>;
  private readonly dispatchStatus: React.Dispatch<EpubStatusAction>;
  private readonly dispatchCalculation: React.Dispatch<EpubCalculationAction>;
  private readonly dispatchCurrent: React.Dispatch<EpubCurrentAction>;

  private settingState: EpubSettingState;
  private currentState: EpubCurrentState;
  private calculationState: EpubCalculationState;

  static init(props: EpubServiceProperties) {
    this.instance = new EpubService(props);
  }

  static get() {
    return this.instance;
  }

  static updateState({
    settingState,
    currentState,
    calculationState
  }: {
    settingState: EpubSettingState,
    currentState: EpubCurrentState,
    calculationState: EpubCalculationState,
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
  }: EpubServiceProperties) {
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
      if (!this.dispatchStatus) return resolve();
      this.dispatchStatus({ type: EpubStatusActionType.SET_READY_TO_READ, readyToRead });
      setTimeout(() => {
        console.log(`readyToRead => ${readyToRead}`);
        resolve();
      }, 0);
    });
  };

  private appendStyles = async ({ metadata }: { metadata: EpubParsedData }): Promise<void> => {
    return measure(() => {
      if (!metadata.styles) return;
      const element = document.createElement('style');
      element.innerText = metadata.styles.join(' ');
      document.head.appendChild(element);
    }, 'Added Styles');
  };

  private waitImagesLoaded = async (): Promise<void> => {
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

  private prepareFonts = async ({ metadata }: { metadata: EpubParsedData }): Promise<void> => {
    if (!metadata.fonts) return Promise.resolve();
    const fontFaces = metadata.fonts.map(({ href, uri }) => {
      const name = href.split('/').slice(-1)[0].replace(/\./g, '_');
      let url = uri ? uri : `${metadata.unzipPath}/${href}`;
      return new FontFace(name, `url("${url}")`);
    });

    return measure(
      () => Promise.all(
        fontFaces.map(fontFace => fontFace.load()
          .then(() => (document as any).fonts.add(fontFace))
          .catch((error) => console.warn('font loading error: ', error)),
        )), `${metadata.fonts.length} fonts loaded`);
  };

  private calculate = async (): Promise<EpubCalculationState> => {
    return measure(() => {
      if (!this.dispatchCalculation) return;
      const calculation: EpubCalculationState = {
        totalPage: 0,
        pageUnit: 0,
        fullHeight: 0,
        fullWidth: 0,
        spines: [],
      };
      const contentRoot = getContentRootElement();
      const spines = contentRoot ? Array.from(contentRoot.getElementsByTagName('article')) : [];
      if (isScroll(this.settingState)) {
        calculation.pageUnit = getClientHeight();
        calculation.fullHeight = getScrollHeight();
        // 스크롤 보기에서 나누어 딱 떨어지지 않는 이상 마지막 페이지에 도달하는 것은 거의 불가능하므로, 전체 페이지 수는 Math.floor(...)로 계산
        calculation.totalPage = Math.floor(calculation.fullHeight / calculation.pageUnit);
        spines.reduce(({ offset, startPage }, { scrollHeight }, index) => {
          const totalPage = Math.floor(scrollHeight / calculation.pageUnit); // todo 이것도 Math.floor(...)로 구하는게 맞나?
          calculation.spines.push({
            spineIndex: index,
            offset,
            total: scrollHeight,
            startPage,
            totalPage,
          });
          return { offset: offset + scrollHeight, startPage: startPage + totalPage };
        }, { offset: 0, startPage: 1 });
      } else {
        calculation.pageUnit = columnWidth(this.settingState) + columnGap(this.settingState);
        calculation.fullWidth = getScrollWidth();
        calculation.totalPage = Math.ceil((calculation.fullWidth + columnGap(this.settingState)) / calculation.pageUnit);

        const defaultOffset = contentRoot ? contentRoot.offsetLeft : 0;

        // 페이지(columnar)보기일 경우 각 spine의 scrollWidth가 제대로 계산되지 않기 때문에 offsetLeft 값 사용
        const { offset, startPage } = spines.reduce(({ offset, startPage }, { offsetLeft }, index) => {
          let totalPage = 0;
          if (index > 0) {
            totalPage = Math.ceil((offsetLeft - offset) / calculation.pageUnit);
            calculation.spines.push({
              spineIndex: index - 1,
              offset: offset - defaultOffset,
              total: offsetLeft - offset,
              startPage,
              totalPage,
            });
          }
          return { offset: offsetLeft, startPage: startPage + totalPage };
        }, { offset: 0, startPage: 1 });
        // 마지막 스파인
        calculation.spines.push({
          spineIndex: spines.length - 1,
          offset: offset - defaultOffset,
          total: calculation.fullWidth - offset,
          startPage,
          totalPage: Math.ceil((calculation.fullWidth - offset) / calculation.pageUnit),
        });
      }

      this.dispatchCalculation({ type: EpubCalculationActionType.UPDATE_CALCULATION, calculation });
      console.log('paging result =>', calculation);
      return { ...this.calculationState, ...calculation };
    }, 'Calculation done');
  };

  private getPageFromSpineIndexAndPosition = async (): Promise<number> => {
    if (this.currentState.currentSpineIndex > this.calculationState.spines.length - 1) return 1;
    const { offset, total, startPage, totalPage } = this.calculationState.spines[this.currentState.currentSpineIndex];
    if (isScroll(this.settingState)) {
      // using offset and total
      console.log('getPageFromSpineIndexAndPosition', `Math.floor((${offset} + ${total} * ${this.currentState.currentPosition}) / ${this.calculationState.pageUnit}) + 1`);
      return Math.floor((offset + total * this.currentState.currentPosition) / this.calculationState.pageUnit) + 1;
    } else {
      // using startPage and totalPage
      return startPage + Math.floor(totalPage * this.currentState.currentPosition);
    }
  };

  private restoreCurrent = async (): Promise<void> => {
    return measure(async () => {
      const page = await this.getPageFromSpineIndexAndPosition();
      console.log('restoring to: ', page);
      return this.goToPage(page);
    }, `Restore current page => spineIndex: ${this.currentState.currentSpineIndex}, position: ${this.currentState.currentPosition}`);
  };

  public goToPage = async (page: number): Promise<void> => {
    const { pageUnit } = this.calculationState;
    return measure(async () => {
      if (isScroll(this.settingState)) {
        setScrollLeft(0);
        setScrollTop((page - 1) * pageUnit);
      } else {
        // todo 2페이지 보기인 경우 짝수 페이지에 도달할 수 없도록 처리 필요
        setScrollLeft((page - 1) * pageUnit);
        setScrollTop(0);
        console.log(`scrollLeft => ${(page - 1) * pageUnit}`);
      }
      this.dispatchCurrent({ type: EpubCurrentActionType.UPDATE_CURRENT, current: { currentPage: page } });
    }, `Go to page => ${page} (${(page - 1) * pageUnit})`);
  };

  public invalidate = async (): Promise<void> => {
    try {
      await this.setReadyToRead(false);
      await this.waitImagesLoaded();
      await ReaderJsHelper.reviseImages();
      this.calculationState = await this.calculate(); // todo 이렇게 강제 업데이트를 해야 하는데, 좀 더 나은 방법?
      await this.restoreCurrent();
    } catch (e) {
      console.error(e);
    }
    await this.setReadyToRead(true);
  };

  public load = async (metadata: EpubParsedData): Promise<void> => {
    await this.setReadyToRead(false);
    await this.appendStyles({ metadata });
    await this.prepareFonts({ metadata });
    Events.emit(SET_CONTENT, metadata.spines);
    await this.invalidate();
    await this.setReadyToRead(true);
  };

  public updateCurrent = async () => {
    return measure(() => {
      const { pageUnit, spines } = this.calculationState;
      let currentPage, currentSpineIndex = 0, currentPosition = 0;
      if (isScroll(this.settingState)) {
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
      console.log("update currentstate => ", { currentPage, currentSpineIndex, currentPosition });
      this.dispatchCurrent({
        type: EpubCurrentActionType.UPDATE_CURRENT,
        current: { currentPage, currentSpineIndex, currentPosition },
      });
    }, 'update current page').catch(error => console.error(error));
  };

  public updateSetting = async (setting: Partial<EpubSettingState>) => {
    if (!this.dispatchSetting) return;
    await this.setReadyToRead(false);
    this.dispatchSetting({ type: EpubSettingActionType.UPDATE_SETTING, setting });
  };
}

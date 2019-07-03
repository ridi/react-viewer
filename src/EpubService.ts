import {
  getClientHeight,
  getContentContainerElement,
  getScrollLeft,
  getScrollTop,
  hasIntersect,
  measure,
  setScrollLeft,
  setScrollTop,
  sleep,
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
} from './contexts';
import * as React from 'react';
import {
  allowedPageNumber,
  columnGap,
  columnsInPage,
  columnWidth,
  hasLayoutSetting,
  isScroll,
} from './utils/EpubSettingUtil';
import ow from 'ow';
import Validator from './validators';

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
  dispatchCalculation: React.Dispatch<EpubCalculationAction>,
  dispatchCurrent: React.Dispatch<EpubCurrentAction>,
  settingState: EpubSettingState,
  currentState: EpubCurrentState,
  calculationState: EpubCalculationState,
}

export class EpubService {
  private static instance?: EpubService;

  private readonly dispatchSetting: React.Dispatch<EpubSettingAction>;
  private readonly dispatchCalculation: React.Dispatch<EpubCalculationAction>;
  private readonly dispatchCurrent: React.Dispatch<EpubCurrentAction>;

  private settingState: EpubSettingState;
  private currentState: EpubCurrentState;
  private calculationState: EpubCalculationState;

  static init(props: EpubServiceProperties) {
    if (this.instance) return;
    this.instance = new EpubService(props);
    console.log('[EpubService] initialized');
  }

  static destroy() {
    if (this.instance) {
      this.instance = undefined;
    }
    console.log('[EpubService] destroyed');
  }

  static isInitialized() {
    return !!this.instance;
  }

  static get() {
    if (!this.instance) throw new Error('There is no initialized `EpubService` instance');
    return this.instance;
  }

  static updateState({
    settingState,
    currentState,
    calculationState,
  }: {
    settingState: EpubSettingState,
    currentState: EpubCurrentState,
    calculationState: EpubCalculationState,
  }) {
    this.get().settingState = settingState;
    this.get().currentState = currentState;
    this.get().calculationState = calculationState;
  }

  private constructor({
    dispatchSetting,
    dispatchCalculation,
    dispatchCurrent,
    settingState,
    currentState,
    calculationState,
  }: EpubServiceProperties) {
    this.dispatchSetting = dispatchSetting;
    this.dispatchCalculation = dispatchCalculation;
    this.dispatchCurrent = dispatchCurrent;
    this.settingState = settingState;
    this.currentState = currentState;
    this.calculationState = calculationState;
  }

  private setCalculation = (calculation: Partial<EpubCalculationState>) => {
    this.dispatchCalculation({ type: EpubCalculationActionType.UPDATE_CALCULATION, calculation });
    this.calculationState = { ...this.calculationState, ...calculation };
  };

  private setSetting = (setting: Partial<EpubSettingState>) => {
    this.dispatchSetting({ type: EpubSettingActionType.UPDATE_SETTING, setting });
    this.settingState = { ...this.settingState, ...setting };
  };

  private setCurrent = (current: Partial<EpubCurrentState>) => {
    this.dispatchCurrent({ type: EpubCurrentActionType.UPDATE_CURRENT, current });
    this.currentState = { ...this.currentState, ...current };
  };

  private setReadyToRead = async (readyToRead: boolean) => {
    return new Promise((resolve) => {
      this.dispatchCurrent({ type: EpubCurrentActionType.SET_READY_TO_READ, readyToRead });
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

  private calculate = async (): Promise<void> => {
    return measure(async () => {
      const calculation: EpubCalculationState = {
        totalPage: 0,
        total: 0,
        pageUnit: 0,
        spines: [],
      };

      const contentContainer = getContentContainerElement();
      if (!contentContainer) return this.calculationState;

      const spines = Array.from(contentContainer.getElementsByTagName('article'));

      if (isScroll(this.settingState)) {
        // 스크롤 보기에서 나누어 딱 떨어지지 않는 이상 마지막 페이지에 도달하는 것은 거의 불가능하므로, 페이지 수는 `Math.floor()`로 계산
        calculation.pageUnit = getClientHeight();

        calculation.spines = spines.map((spine, spineIndex) => {
          const total = spine.scrollHeight;
          const offset = spine.offsetTop;
          const startPage = Math.floor(offset / calculation.pageUnit) + 1;
          const totalPage = Math.floor(total / calculation.pageUnit);
          return { spineIndex, offset, total, startPage, totalPage };
        });

        const { offset, total } = calculation.spines.slice(-1)[0];
        calculation.total = offset + total;
        calculation.totalPage = Math.floor((offset + total) / calculation.pageUnit);
      } else {
        // 페이지 보기에서 각 spine 엘리먼트의 `scrollWidth` 값이 정확하지 않기 때문에 다른 방식으로 대체
        // 1. `boundingClientRect.width/height` 값 사용:  (X)
        //    -> 문제점:
        //       - 크롬 특정 버전에서 `height` -> `width`로 변경됨
        //       - 컬럼 갯수가 10000개 이상일떄는 boundingClientRect.width/height 값이 0이 나오는 문제가 있음
        // 2. `offsetLeft` 사용: (O)
        //    -> 10000 컬럼 넘어가더라도값이 정확
        //    -> 문제점:
        //        - 계산이 복잡해진다는 문제가 있지만 값은 정확히 나옴
        //        - 마지막 스파인의 total 값을 구하기 위해 `scrollWidth`를 사용하면 boundingClientRect처럼 10000 컬럼 이상의 길이를 구하지 못한다.
        //        - 마지막에 <article> 하나를 더 추가하는 방식으로 해결, 마지막 article에 대해서는 계산하지 않음
        //        - 이제 페이지 계산은 잘 되지만 scrollLeft로 10000페이지 이상의 페이지에 도달하지 못하고, 실제로 브라우저에서 10000번째 컬럼부터 렌더링 자체를 하지 않는다.
        //        - 이제 나는 모르겠다아아아앙아아
        const fakeSpine = document.createElement('article');
        fakeSpine.style.marginTop = '99%'; // 이렇게 하지 않으면 마지막 스파인의 내용이 짧을 경우 0페이지로 계산될 수 있다.
        contentContainer.appendChild(fakeSpine);
        spines.push(fakeSpine);

        await sleep(0);

        calculation.pageUnit = columnWidth(this.settingState) + columnGap(this.settingState);

        const defaultOffset = contentContainer ? contentContainer.offsetLeft : 0;
        spines.reduce(({ offset, startPage }, { offsetLeft }, index) => {
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

        const { offset, total, startPage, totalPage } = calculation.spines.slice(-1)[0];
        calculation.total = offset + total;
        calculation.totalPage = startPage + totalPage - 1;

        contentContainer.removeChild(fakeSpine);
      }

      this.setCalculation(calculation);
      console.log('paging result =>', calculation);
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

  public goToPage = async (requestPage: number): Promise<void> => {
    ow(requestPage, 'EpubService.goToPage(page)', Validator.Common.Page);

    const page = allowedPageNumber(this.settingState, this.calculationState, requestPage);
    const { pageUnit } = this.calculationState;

    const scrollTo = (page - 1) * pageUnit;

    return measure(async () => {
      if (isScroll(this.settingState)) {
        setScrollLeft(0);
        setScrollTop(scrollTo);
      } else {
        // todo 2페이지 보기인 경우 짝수 페이지에 도달할 수 없도록 처리 필요
        setScrollLeft(scrollTo);
        setScrollTop(0);
        console.log(`scrollLeft => ${(page - 1) * pageUnit}`);
      }

      this.setCurrent({ currentPage: page });
    }, `Go to page => ${page} (${(page - 1) * pageUnit})`);
  };

  public invalidate = async (): Promise<void> => {
    try {
      await this.setReadyToRead(false);
      await this.waitImagesLoaded();
      await ReaderJsHelper.reviseImages();
      await this.calculate();
      await this.restoreCurrent();
    } catch (e) {
      console.error(e);
    }
    await this.updateCurrent();
    await this.setReadyToRead(true);
  };

  public load = async (metadata: EpubParsedData): Promise<void> => {
    ow(metadata, 'EpubService.load(metadata)', Validator.Epub.EpubParsedData);

    await this.setReadyToRead(false);
    await this.appendStyles({ metadata });
    await this.prepareFonts({ metadata });
    Events.emit(SET_CONTENT, metadata.spines);
    await this.invalidate();
  };

  private getCurrentFromScrollPosition = (scrollTopOrLeft: number): Partial<EpubCurrentState> => {
    const { pageUnit, spines } = this.calculationState;
    const result: Partial<EpubCurrentState> = {
      currentPage: Math.floor(scrollTopOrLeft / pageUnit) + 1,
      currentSpineIndex: 0,
      currentPosition: 0,
      visibleSpineIndexes: [],
    };

    if (isScroll(this.settingState)) {
      const scrollTop = scrollTopOrLeft;
      const results = spines.filter(({ offset, total }) => {
        const viewRange = [scrollTop, scrollTop + pageUnit];
        const spineRange = [offset, offset + total];
        return hasIntersect(viewRange, spineRange);
      });
      if (results && results.length > 0) {
        result.currentSpineIndex = results[0].spineIndex;
        // 첫 스파인 상단에 존재하는 margin 영역 때문에 마이너스 값이 나올 수 있으므로 보정
        result.currentPosition = Math.max((scrollTop - results[0].offset) / results[0].total, 0);
        result.visibleSpineIndexes = results.map(({ spineIndex }) => spineIndex);
      }
    } else {
      const scrollLeft = scrollTopOrLeft;
      const results = spines.filter(({ offset, total }) => {
        const viewRange = [scrollLeft, scrollLeft + (pageUnit * columnsInPage(this.settingState))];
        const spineRange = [offset, offset + total];
        return hasIntersect(viewRange, spineRange);
      });
      if (results && results.length > 0) {
        result.currentSpineIndex = results[0].spineIndex;
        result.currentPosition = (scrollLeft - results[0].offset) / results[0].total;
        result.visibleSpineIndexes = results.map(({ spineIndex }) => spineIndex);
      }
    }

    return result;
  };

  public updateCurrent = async () => {
    return measure(() => {
      const current = this.getCurrentFromScrollPosition(isScroll(this.settingState) ? getScrollTop() : getScrollLeft());
      this.setCurrent(current);
      console.log('update currentstate => ', current);
    }, 'update current page').catch(error => console.error(error));
  };

  public updateSetting = async (setting: Partial<EpubSettingState>) => {
    ow(setting, 'EpubService.updateSetting(setting)', Validator.Epub.SettingState);
    this.setSetting(setting);
    if (hasLayoutSetting(setting)) {
      await this.invalidate();
    }
  };
}

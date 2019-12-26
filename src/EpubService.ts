import path from 'path';
import {
  getClientHeight,
  getContentContainerElement,
  getScrollLeft,
  getScrollTop,
  hasIntersect,
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
  initialEpubCurrentState,
} from './contexts';
import * as React from 'react';
import { allowedPageNumber, columnGap, columnsInPage, columnWidth, isScroll } from './utils/EpubSettingUtil';
import ow from 'ow';
import Validator from './validators';

export interface FontData {
  href: string;
  uri?: string;
}

export interface EpubParsedData {
  type: 'epub';
  fonts?: Array<FontData>;
  styles?: Array<String>;
  spines?: Array<String>;
  unzipPath: string;
}

interface EpubServiceProperties {
  dispatchSetting: React.Dispatch<EpubSettingAction>;
  dispatchCalculation: React.Dispatch<EpubCalculationAction>;
  dispatchCurrent: React.Dispatch<EpubCurrentAction>;
  settingState: EpubSettingState;
  currentState: EpubCurrentState;
  calculationState: EpubCalculationState;
}

const APPENDED_STYLE_ATTR = 'data-react-reader';

export class EpubService {
  private static instance?: EpubService;

  private readonly dispatchSetting: React.Dispatch<EpubSettingAction>;
  private readonly dispatchCalculation: React.Dispatch<EpubCalculationAction>;
  private readonly dispatchCurrent: React.Dispatch<EpubCurrentAction>;

  private settingState: EpubSettingState;
  private currentState: EpubCurrentState;
  private calculationState: EpubCalculationState;
  private isLoaded: boolean = false;
  private isImageLoaded: boolean = false;

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
    settingState: EpubSettingState;
    currentState: EpubCurrentState;
    calculationState: EpubCalculationState;
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

  private setReadyToRead = (readyToRead: boolean) => {
    this.dispatchCurrent({ type: EpubCurrentActionType.SET_READY_TO_READ, readyToRead });
  };

  // 이펍 내 콘텐츠 스타일을 추가합니다.
  private appendStyles = ({ metadata }: { metadata: EpubParsedData }) => {
    document.querySelectorAll(`[${APPENDED_STYLE_ATTR}]`).forEach(e => e.remove());

    if (!metadata.styles) return;
    const element = document.createElement('style');
    element.setAttribute(APPENDED_STYLE_ATTR, '');
    element.innerText = metadata.styles.join(' ');
    document.head.appendChild(element);
    console.log('epub content styles appended:', metadata.styles.length);
  };

  // 이펍에 내장된 폰트들을 로드합니다.
  // DOM에 콘텐츠가 추가되기 전에 폰트 로드를 완료시키기 위해 FontFace를 사용합니다.
  // 콘텐츠가 추가된 후 CSS에 의해 자연스럽게 로드 되는 것을 기다리면 페이지 계산 중에 로드가 완료되는 폰트가 있을 수 있고 그로인해 페이지 오차가 생깁니다.
  private loadFonts = async ({ metadata }: { metadata: EpubParsedData }): Promise<void> => {
    if (!metadata.fonts) return;
    const fontFaces = metadata.fonts.map(({ href, uri }) => {
      const name = href
        .split('/')
        .slice(-1)[0]
        .replace(/\./g, '_');
      const basePath = metadata.unzipPath.replace(/\\/g, '/');
      let url = uri ? uri : path.join(basePath, href);
      return new FontFace(name, `url("${url}")`);
    });

    await Promise.all(
      fontFaces.map(fontFace => 
        fontFace
          .load()
          .then(() => {
            console.log('epub embedded font loaded:', fontFace.family);
            (document as any).fonts.add(fontFace);
          })
          .catch((error) => console.warn('epub embedded font loading error:', error)),
      )
    )
  };

  // DOM에 콘텐츠를 추가하기 전에 실행되어야 할 코드들입니다.
  // 콘텐츠 추가 후 실행되면 페이징 오차가 발생합니다.
  private prepareLoad = async ({ metadata }: { metadata: EpubParsedData }, completion: Function) => {
    this.appendStyles({ metadata });
    await this.loadFonts({ metadata });
    completion();
  }

  // 이펍 콘텐츠 내 모든 이미지의 로드가 완료되길 기다립니다.
  private waitImagesLoaded = async () => {
    if (this.isImageLoaded) return;
    const images = Array.from(document.images);

    if (images.length > 0) {
      let count = 0;
      await new Promise((resolve) => {
        const onComplete = () => {
          count += 1;
          if (count === images.length) {
            resolve();
          }
        }
        images.forEach((image) => {
          if (image.complete) {
            onComplete();
          } else {
            image.addEventListener('load', onComplete);
            image.addEventListener('error', onComplete);
          }
        });
      });
    }
    console.log('epub content images loaded:', images.length);
  }

  // 페이징 시작 전에 실행되어야 할 코드들입니다.
  // 페이징 시작 후 실행되면 페이징 오차가 발생합니다.
  private prepareCalculate = async (completion: Function) => {
    await this.waitImagesLoaded();
    ReaderJsHelper.reviseImages();
    setTimeout(() => {
      completion();
    }, 0); // FIXME: Reader.js의 이미지 보정 리펙토링 전까진 지워선 안됩니다.
  }

  private calculate = () => {
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
      if (spines.length === 0) return this.calculationState;
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

      calculation.pageUnit = columnWidth(this.settingState) + columnGap(this.settingState);

      const defaultOffset = contentContainer ? contentContainer.offsetLeft : 0;
      spines.reduce(
        ({ offset, startPage }, { offsetLeft }, index) => {
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
        },
        { offset: 0, startPage: 1 },
      );

      const { offset, total, startPage, totalPage } = calculation.spines.slice(-1)[0];
      calculation.total = offset + total;
      calculation.totalPage = startPage + totalPage - 1;

      contentContainer.removeChild(fakeSpine);
    }

    this.setCalculation(calculation);
    console.log('paging result =>', calculation);
  };

  private getPageFromSpineIndexAndPosition = () => {
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

  private restoreCurrent = () => {
    const page = this.getPageFromSpineIndexAndPosition();
    console.log('restoring to: ', page);
    this.goToPage(page);
  };

  public goToPage = (requestPage: number) => {
    ow(requestPage, 'EpubService.goToPage(page)', Validator.Common.Page);

    const page = allowedPageNumber(this.settingState, this.calculationState, requestPage);
    const { pageUnit } = this.calculationState;

    const scrollTo = (page - 1) * pageUnit;

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
  };

  public invalidate = () => {
    if (!this.isLoaded) return;
    const defer = () => {
      this.updateCurrent();
      this.setReadyToRead(true);
    };
    try {
      this.setReadyToRead(false);
      this.prepareCalculate(() => {
        this.calculate();
        this.restoreCurrent();
        defer();
      });
    } catch (e) {
      console.error(e);
      defer();
    }
  };

  public load = (metadata: EpubParsedData) => {
    ow(metadata, 'EpubService.load(metadata)', Validator.Epub.EpubParsedData);
    this.setCurrent(initialEpubCurrentState);
    this.isLoaded = true;
    this.setReadyToRead(false);
    this.prepareLoad({ metadata }, () => {
      Events.emit(SET_CONTENT, metadata.spines);
    });
  };

  private getCurrentFromScrollPosition = (scrollTopOrLeft: number): Partial<EpubCurrentState> => {
    const { pageUnit, spines } = this.calculationState;
    const result: Partial<EpubCurrentState> = {
      currentPage: Math.floor(scrollTopOrLeft / pageUnit) + 1 || 1,
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
        const viewRange = [scrollLeft, scrollLeft + pageUnit * columnsInPage(this.settingState)];
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

  public updateCurrent = () => {
    const current = this.getCurrentFromScrollPosition(isScroll(this.settingState) ? getScrollTop() : getScrollLeft());
    this.setCurrent(current);
    console.log('update currentstate => ', current);
  };

  public updateSetting = (setting: Partial<EpubSettingState>) => {
    ow(setting, 'EpubService.updateSetting(setting)', Validator.Epub.SettingState);
    this.setReadyToRead(false);
    this.setSetting(setting);
    if (this.settingState.autoInvalidation) {
      this.invalidate();
    }
  };
}

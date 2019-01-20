import {
  merge,
  of,
  from,
  timer,
} from 'rxjs';
import {
  filter,
  tap,
  map,
  mergeMap,
  switchMap,
  debounce,
  distinctUntilChanged,
} from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import { ViewType } from '../constants/SettingConstants';
import { FOOTER_INDEX, PRE_CALCULATION } from '../constants/CalculationsConstants';
import { ContentFormat } from '../constants/ContentConstants';
import Logger from '../util/Logger';
import DOMEventDelayConstants from '../constants/DOMEventDelayConstants';
import { screenHeight, screenWidth } from '../util/BrowserWrapper';
import AnnotationStore from '../store/AnnotationStore';
import ReaderJsHelper from './readerjs/ReaderJsHelper';

class CalculationService extends BaseService {
  static settingsAffectingCalculation = [
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

  static defaultConfigs = {
    beforeContentCalculated: (/* contentIndex, readerJsHelper */) => Promise.resolve(),
    afterContentCalculated: (/* calculations */) => Promise.resolve(),
  };

  _getCalculationTargetContents() {
    const contentCountAtATime = 4;

    const calculatedContents = Connector.calculations.getContentCalculations();
    if (Connector.calculations.isCompleted()) return [];

    return calculatedContents
      .filter(({ index }) => {
        const content = Connector.content.getContents(index);
        return content.isContentLoaded || content.isContentOnError;
      })
      .filter(({ total }) => total === PRE_CALCULATION)
      .map(({ index }) => index)
      .slice(0, contentCountAtATime);
  }

  _checkAllCompleted({ index: lastCalculatedIndex, total: lastCalculatedTotal }) {
    const calculatedContents = Connector.calculations.getContentCalculations();
    const calculatedFooter = Connector.calculations.getFooterCalculations();

    const cache = calculatedContents
      .map(({ index, total, offset }) => ({ index, total, offset }))
      .concat([{ index: FOOTER_INDEX, offset: calculatedFooter.offset, total: calculatedFooter.total }]);

    cache.forEach(({ index, total, offset }, i) => {
      if (index === FOOTER_INDEX) return;
      const currentTotal = index === lastCalculatedIndex ? lastCalculatedTotal : total;
      if (currentTotal === PRE_CALCULATION || offset === PRE_CALCULATION) return;

      cache[i + 1] = { ...cache[i + 1], offset: offset + currentTotal };
      Connector.calculations.setStartOffset(cache[i + 1].index, offset + currentTotal);
    });

    const completed = cache.every(({ offset, total }) => offset !== PRE_CALCULATION && total !== PRE_CALCULATION);
    const calculatedTotal = cache.reduce((sum, content) => sum + content.total, 0);

    Connector.calculations.setCalculationsTotal(calculatedTotal, completed);
    if (completed) EventBus.emit(Events.CALCULATION_COMPLETED);

    return cache;
  }

  _calculateContent({ index, contentNode, contentFooterNode }) {
    const { viewType, startWithBlankPage, columnsInPage } = Connector.setting.getSetting();
    const contentFormat = Connector.content.getContentFormat();

    // PAGE
    if (viewType === ViewType.PAGE) {
      if (index === FOOTER_INDEX) {
        const { hasFooter } = Connector.calculations;
        return of({ index, total: hasFooter ? 1 : 0 });
      }
      if (contentFormat === ContentFormat.IMAGE) {
        const contents = Connector.content.getContents();
        return of({ index, total: Math.ceil((contents.length + startWithBlankPage) / columnsInPage) });
      }
      return timer().pipe(
        map(() => ({
          index,
          total: Math.ceil(contentNode.scrollWidth / (Connector.setting.getContainerWidth()
            + Connector.setting.getColumnGap())),
        })),
      );
    }
    // SCROLL
    if (index === FOOTER_INDEX) {
      const total = contentNode.scrollHeight;
      return of({ index, total });
    }
    const isLastContent = Connector.calculations.isLastContent(index);
    return timer().pipe(
      map(() => ({
        index,
        total: contentNode.scrollHeight
          + (isLastContent && contentFooterNode ? Connector.setting.getContentFooterHeight() : 0),
      })),
    );
  }

  load(_, config) {
    this.config = { ...CalculationService.defaultConfigs, ...config };
    this.connectEvents(this.onCalculateContent.bind(this), Events.CALCULATE_CONTENT);
    this.connectEvents(this.onCalculationNeeded.bind(this), Events.ALL_CONTENT_LOADED, Events.RESIZE, Events.SETTING_UPDATED);
    this.connectEvents(this.onCalculationInvalidated.bind(this), Events.CALCULATION_INVALIDATED);
    this.connectEvents(this.onCalculated.bind(this), Events.CALCULATION_UPDATED);
  }

  onCalculationInvalidated(invalidate$) {
    return invalidate$.subscribe(() => {
      Connector.calculations.setReadyToRead(false);
      Connector.calculations.invalidate();
      AnnotationStore.invalidateCalculations();
    });
  }

  onCalculationNeeded(loadAllContent$, resize$, updateSetting$) {
    return merge(
      loadAllContent$.pipe(
        filter(() => {
          if (Connector.calculations.isCompleted()) {
            EventBus.emit(Events.CALCULATION_COMPLETED);
            return false;
          }
          return true;
        }),
      ),
      resize$.pipe(
        debounce(() => timer(DOMEventDelayConstants.RESIZE)),
        map(() => ({ w: screenWidth(), h: screenHeight() })),
        distinctUntilChanged(({ w: bw, h: bh }, { w: aw, h: ah }) => bw === aw && bh === ah),
      ),
      updateSetting$.pipe(
        filter(settingName => !CalculationService.settingsAffectingCalculation.includes(settingName)),
      ),
    ).pipe(
      tap(() => EventBus.emit(Events.CALCULATION_INVALIDATED)),
      tap(() => Connector.calculations.setTargets(this._getCalculationTargetContents())),
      switchMap(() => EventBus.asObservable(Events.CALCULATION_UPDATED)),
      map(() => this._getCalculationTargetContents()),
    ).subscribe({
      next: nextTargets => Connector.calculations.setTargets(nextTargets),
      error: error => Logger.error(error),
      complete: () => Logger.debug('calculationTargetsSubscription complete'),
    });
  }

  onCalculateContent(calculateContent$) {
    return calculateContent$.pipe(
      mergeMap(({ data }) => this._calculateContent(data)),
      tap(({ index, total }) => Connector.calculations.setContentTotal(index, total)),
      mergeMap(({ index, total }) => from(this.config.beforeContentCalculated(index, ReaderJsHelper.get(index))).pipe(
        map(() => ({ index, total })),
      )),
    ).subscribe(({ index, total }) => EventBus.emit(Events.CALCULATION_UPDATED, { index, total }));
  }

  onCalculated(calculationUpdated$) {
    return calculationUpdated$.pipe(
      map(({ index, total }) => this._checkAllCompleted({ index, total })),
      mergeMap(calculations => from(this.config.afterContentCalculated(calculations))),
    ).subscribe();
  }
}

export default new CalculationService();

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
  share,
} from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import { ViewType } from '../constants/SettingConstants';
import { FOOTER_INDEX, PRE_CALCULATION } from '../constants/CalculationsConstants';
import { ContentFormat, PRE_CALCULATED_RATIO } from '../constants/ContentConstants';
import DOMEventDelayConstants from '../constants/DOMEventDelayConstants';
import { screenHeight, screenWidth } from '../util/BrowserWrapper';
import AnnotationStore from '../store/AnnotationStore';
import ReaderJsHelper from './readerjs/ReaderJsHelper';

class CalculationService extends BaseService {
  static settingsAffectingCalculation = [
    'viewType',
    'font',
    'fontSizeInEm',
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

  load(_, config) {
    this.config = { ...CalculationService.defaultConfigs, ...config };
    this.connectEvents(this.onCalculateContent.bind(this), Events.CALCULATE_CONTENT);
    this.connectEvents(this.onCalculationNeeded.bind(this), Events.RESIZE, Events.SETTING_UPDATED);
    this.connectEvents(this.onCalculationStarted.bind(this), Events.ALL_CONTENT_READY, Events.ALL_CONTENT_LOADED);
    this.connectEvents(this.onCalculationInvalidated.bind(this), Events.CALCULATION_INVALIDATED);
    this.connectEvents(this.onCalculated.bind(this), Events.CALCULATION_UPDATED);
  }

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

    let cache = calculatedContents.map(({ index, total, offset }) => ({ index, total, offset }));
    if (Connector.calculations.hasFooter) {
      cache = cache.concat([{ index: FOOTER_INDEX, offset: calculatedFooter.offset, total: calculatedFooter.total }]);
    }

    cache.forEach(({ index, total, offset }, i) => {
      if (i === cache.length - 1) return;
      const currentTotal = index === lastCalculatedIndex ? lastCalculatedTotal : total;
      if (currentTotal === PRE_CALCULATION || offset === PRE_CALCULATION) return;

      const isFooter = cache[i + 1].index === FOOTER_INDEX;
      const startOffset = isFooter ? Math.ceil(offset + currentTotal) : offset + currentTotal;
      cache[i + 1] = { ...cache[i + 1], offset: startOffset };
      Connector.calculations.setStartOffset(cache[i + 1].index, startOffset);
    });

    const completed = cache.every(({ offset, total }) => offset !== PRE_CALCULATION && total !== PRE_CALCULATION);
    const calculatedTotal = cache.reduce((sum, { total }) => sum + (total !== PRE_CALCULATION ? total : 0), 0);

    Connector.calculations.setCalculationsTotal(calculatedTotal, completed);
    if (completed) EventBus.emit(Events.CALCULATION_COMPLETED);

    return cache;
  }

  _calculateHtmlContent({
    index,
    contentNode,
    contentFooterNode,
  }) {
    const { viewType } = Connector.setting.getSetting();

    // PAGE
    if (viewType === ViewType.PAGE) {
      if (index === FOOTER_INDEX) {
        const { hasFooter } = Connector.calculations;
        return of({ index, total: hasFooter ? 1 : 0 });
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

  _calculateImageContents() {
    const contents = Connector.content.getContents();
    const { viewType, columnsInPage, startWithBlankPage } = Connector.setting.getSetting();
    const containerWidth = Connector.setting.getContainerWidth();

    let contentCalculations = null;
    // PAGE
    if (viewType === ViewType.PAGE) {
      contentCalculations = contents.map(({ index }) => ({
        index,
        isCalculated: true,
        offset: ((1 / columnsInPage) * (index - 1)) + (startWithBlankPage / columnsInPage),
        total: 1 / columnsInPage,
      }));
    }
    // SCROLL
    if (viewType === ViewType.SCROLL) {
      let offset = 0;
      contentCalculations = contents.map(({ index, ratio = PRE_CALCULATED_RATIO }) => {
        const total = containerWidth * (ratio === PRE_CALCULATED_RATIO ? 1.4 : ratio); // fixme default value
        const result = {
          index,
          isCalculated: true,
          offset,
          total,
        };
        offset += total;
        return result;
      });
    }

    const last = contentCalculations[contentCalculations.length - 1];

    return {
      contents: contentCalculations,
      contentTotal: Math.ceil(last.offset + last.total),
    };
  }

  onCalculationInvalidated(invalidate$) {
    return invalidate$.subscribe(() => {
      if (Connector.content.getContentFormat() === ContentFormat.IMAGE) {
        Connector.calculations.setReadyToRead(true);
        EventBus.emit(Events.READY_TO_READ);
      }
      if (Connector.content.getContentFormat() === ContentFormat.HTML) {
        Connector.calculations.setReadyToRead(false);
      }

      Connector.calculations.invalidate();
      AnnotationStore.invalidateCalculations();
    });
  }

  onCalculationNeeded(resize$, updateSetting$) {
    const debouncedResize$ = resize$.pipe(
      debounce(() => timer(DOMEventDelayConstants.RESIZE)),
      map(() => ({ w: screenWidth(), h: screenHeight() })),
      distinctUntilChanged(({ w: bw, h: bh }, { w: aw, h: ah }) => bw === aw && bh === ah),
      share(),
    );
    const filteredUpdateSetting$ = updateSetting$.pipe(
      filter(({ data }) => Object.keys(data)
        .some(key => CalculationService.settingsAffectingCalculation.includes(key))),
      share(),
    );
    const imageResize$ = debouncedResize$.pipe(filter(() => Connector.content.getContentFormat() === ContentFormat.IMAGE));
    const htmlResize$ = debouncedResize$.pipe(filter(() => Connector.content.getContentFormat() === ContentFormat.HTML));
    const imageUpdateSetting$ = filteredUpdateSetting$.pipe(filter(() => Connector.content.getContentFormat() === ContentFormat.IMAGE));
    const htmlUpdateSetting$ = filteredUpdateSetting$.pipe(filter(() => Connector.content.getContentFormat() === ContentFormat.HTML));

    const image$ = merge(imageResize$, imageUpdateSetting$).pipe(
      map(() => this._calculateImageContents()),
      tap(calculations => Connector.calculations.setCalculations(calculations)),
      tap(() => EventBus.emit(Events.CALCULATIONS_SET)),
    );
    const html$ = merge(htmlResize$, htmlUpdateSetting$).pipe(
      tap(() => EventBus.emit(Events.CALCULATION_INVALIDATED)),
      tap(() => Connector.calculations.setTargets(this._getCalculationTargetContents())),
      switchMap(() => EventBus.asObservable(Events.CALCULATION_UPDATED)),
      map(() => Connector.calculations.setTargets(this._getCalculationTargetContents())),
    );

    return merge(image$, html$).subscribe();
  }

  onCalculationStarted(allContentsReady$, allContentsLoaded$) {
    return merge(
      allContentsReady$.pipe(
        filter(() => Connector.content.getContentFormat() === ContentFormat.IMAGE),
        filter(() => {
          if (Connector.calculations.isCompleted()) {
            EventBus.emit(Events.CALCULATION_COMPLETED);
            return false;
          }
          return true;
        }),
        map(() => this._calculateImageContents()),
        tap(calculations => Connector.calculations.setCalculations(calculations)),
        tap(() => EventBus.emit(Events.CALCULATIONS_SET)),
        tap(() => {
          Connector.calculations.setReadyToRead(true);
          EventBus.emit(Events.READY_TO_READ);
        }), tap(() => {
          Connector.calculations.setReadyToRead(true);
          EventBus.emit(Events.READY_TO_READ);
        }),
      ),
      allContentsLoaded$.pipe(
        filter(() => Connector.content.getContentFormat() === ContentFormat.HTML),
        filter(() => {
          if (Connector.calculations.isCompleted()) {
            EventBus.emit(Events.CALCULATION_COMPLETED);
            return false;
          }
          return true;
        }),
        tap(() => EventBus.emit(Events.CALCULATION_INVALIDATED)),
        tap(() => Connector.calculations.setTargets(this._getCalculationTargetContents())),
        switchMap(() => EventBus.asObservable(Events.CALCULATION_UPDATED)),
        tap(() => Connector.calculations.setTargets(this._getCalculationTargetContents())),
      ),
    ).subscribe();
  }

  onCalculateContent(calculateContent$) {
    return calculateContent$.pipe(
      mergeMap(({ data }) => this._calculateHtmlContent(data)),
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

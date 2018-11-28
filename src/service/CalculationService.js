import { merge, of, timer } from 'rxjs';
import { filter, tap, map, mergeMap, startWith, iif } from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import { EMPTY_READ_LOCATION, ViewType } from '../constants/SettingConstants';
import CalculationsConnector from './connector/CalculationsConnector';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import { FOOTER_INDEX, PRE_CALCULATION } from '../constants/CalculationsConstants';
import { waitThenRun } from '../util/BrowserWrapper';
import { ContentFormat } from '../constants/ContentConstants';
import Logger from '../util/Logger';

class CalculationService extends BaseService {
  settingsAffectingCalculation = [
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

  _getCalculationTargetContents() {
    const contentCountAtATime = 4;

    const calculatedContents = Connector.calculations.getContentCalculations();
    if (Connector.calculations.isCompleted()) return [];

    return calculatedContents
      .filter(({ index }) => {
        const content = Connector.content.getContents(index);
        return content.isContentLoaded || content.isContentOnError;
      })
      .filter(({ isCalculated }) => !isCalculated)
      .map(({ index }) => index)
      .slice(0, contentCountAtATime);
  }

  _checkAllCompleted() {
    const calculatedContents = Connector.calculations.getContentCalculations();
    const calculatedFooter = Connector.calculations.getFooterCalculations();
    const contentFormat = Connector.content.getContentFormat();

    const isAllContentsCalculated = contentFormat === ContentFormat.HTML
      ? calculatedContents.every(content => content.isCalculated)
      : calculatedContents[0].isCalculated;
    const isFooterCalculated = !Connector.calculations.hasFooter || calculatedFooter.isCalculated;
    const completed = isAllContentsCalculated && isFooterCalculated;

    calculatedContents.forEach(({ index, isCalculated, total }) => {
      if (!isCalculated) return;
      const nextIndex = (index === calculatedContents.length) ? FOOTER_INDEX : index + 1;
      if (Connector.calculations.getStartOffset(nextIndex) !== PRE_CALCULATION) return;
      Connector.calculations.setStartOffset(nextIndex, Connector.calculations.getStartOffset(index) + total);
    });

    const calculatedTotal = calculatedContents.reduce((sum, content) => sum + content.total, calculatedFooter.total);
    Connector.calculations.setCalculationsTotal(calculatedTotal, completed);
    if (completed) EventBus.emit(Events.calculation.CALCULATION_COMPLETED);
  }

  _calculationTargets$() {
    return merge(
      EventBus.asObservable(Events.content.ALL_CONTENT_LOADED),
      EventBus.asObservable(Events.core.RESIZE),
      EventBus.asObservable(Events.core.SETTING_UPDATED).pipe(
        filter(settingName => this.settingsAffectingCalculation.includes(settingName)),
      ),
    ).pipe(
      tap(() => Connector.calculations.invalidate()),
      tap(() => EventBus.emit(Events.calculation.CALCULATION_INVALIDATED)),
      tap(() => Connector.calculations.setTargets(this._getCalculationTargetContents())),
      mergeMap(() => EventBus.asObservable(Events.calculation.CALCULATION_UPDATED)),
      tap(() => this._checkAllCompleted()),
      map(() => this._getCalculationTargetContents()),
    );
  }

  load() {
    super.load();
    this.connectEvents(this.onCalculateContent.bind(this), Events.calculation.CALCULATE_CONTENT);
    this.calculationTargetsSubscription = this._calculationTargets$().subscribe({
      next: nextTargets => Connector.calculations.setTargets(nextTargets),
      error: error => Logger.error(error),
      complete: () => Logger.debug('calculationTargetsSubscription complete'),
    });
  }

  unload() {
    super.unload();
    this.calculationTargetsSubscription.unsubscribe();
  }

  onCalculateContent(calculateContent$) {
    return calculateContent$.pipe(
      mergeMap(({ data }) => this._calculateContent(data)),
      tap(({ index, total }) => Connector.calculations.setContentTotal(index, total)),
    ).subscribe(({ index, total }) => EventBus.emit(Events.calculation.CALCULATION_UPDATED, { index, total }));
  }

  _calculateContent({ index, contentNode, contentFooter }) {
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
      return of({ index, total: contentNode.offsetHeight });
    }
    const isLastContent = Connector.calculations.isLastContent(index);
    return timer().pipe(
      map(() => ({
        index,
        total: contentNode.scrollHeight
          + (isLastContent && contentFooter ? Connector.setting.getContentFooterHeight() : 0),
      })),
    );
  }
}

export default new CalculationService();

import { merge, of, timer } from 'rxjs';
import {
  filter,
  tap,
  map,
  mergeMap,
  switchMap, debounce, distinctUntilChanged,
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

    calculatedContents.forEach(({ index, isCalculated, total }) => {
      const offset = Connector.calculations.getStartOffset(index);
      if (!isCalculated || offset === PRE_CALCULATION) return;
      const nextIndex = (index === calculatedContents.length) ? FOOTER_INDEX : index + 1;
      if (nextIndex === FOOTER_INDEX) {
        Logger.debug('footer calculation', index, isCalculated, total, offset);
      }
      Connector.calculations.setStartOffset(nextIndex, offset + total);
    });

    const isAllContentsCalculated = contentFormat === ContentFormat.HTML
      ? calculatedContents.every(content => content.isCalculated)
      : calculatedContents[0].isCalculated;
    const isFooterCalculated = !Connector.calculations.hasFooter || calculatedFooter.isCalculated;
    const completed = isAllContentsCalculated && isFooterCalculated;

    const calculatedTotal = calculatedContents.reduce((sum, content) => sum + content.total, calculatedFooter.total);
    Connector.calculations.setCalculationsTotal(calculatedTotal, completed);
    if (completed) EventBus.emit(Events.calculation.CALCULATION_COMPLETED);
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

  load() {
    super.load();
    this.connectEvents(this.onCalculateContent.bind(this), Events.calculation.CALCULATE_CONTENT);
    this.connectEvents(this.onCalculated.bind(this), Events.content.ALL_CONTENT_LOADED, Events.core.RESIZE, Events.setting.SETTING_UPDATED);
  }

  onCalculated(loadAllContent$, resize$, updateSetting$) {
    return merge(
      loadAllContent$,
      resize$.pipe(
        debounce(() => timer(DOMEventDelayConstants.RESIZE)),
        map(() => ({ w: screenWidth(), h: screenHeight() })),
        distinctUntilChanged(({ w: bw, h: bh }, { w: aw, h: ah }) => bw === aw && bh === ah),
      ),
      updateSetting$.pipe(
        filter(settingName => !this.settingsAffectingCalculation.includes(settingName)),
      ),
    ).pipe(
      tap(() => Connector.calculations.invalidate()),
      tap(() => EventBus.emit(Events.calculation.CALCULATION_INVALIDATED)),
      tap(() => Connector.calculations.setTargets(this._getCalculationTargetContents())),
      switchMap(() => EventBus.asObservable(Events.calculation.CALCULATION_UPDATED)),
      tap(() => this._checkAllCompleted()),
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
    ).subscribe(({ index, total }) => EventBus.emit(Events.calculation.CALCULATION_UPDATED, { index, total }));
  }
}

export default new CalculationService();

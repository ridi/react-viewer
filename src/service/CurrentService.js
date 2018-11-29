import { merge, timer } from 'rxjs';
import {
  map,
  filter,
  tap,
  debounce,
  distinctUntilChanged,
} from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import CalculationsConnector from './connector/CalculationsConnector';
import { EMPTY_READ_LOCATION } from '..';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import { screenHeight, scrollTop } from '../util/BrowserWrapper';
import Logger from '../util/Logger';
import DOMEventDelayConstants from '../constants/DOMEventDelayConstants';
import { FOOTER_INDEX, PRE_CALCULATION } from '../constants/CalculationsConstants';
import { hasIntersect } from '../util/Util';

class CurrentService extends BaseService {
  isRestored = false;

  load() {
    super.load();
    this.connectEvents(this.onCalculationInvalidated.bind(this), Events.calculation.CALCULATION_INVALIDATED);
    this.connectEvents(this.onCalculated.bind(this), Events.calculation.CALCULATION_UPDATED);
    this.connectEvents(this.onCurrentUpdated.bind(this), Events.core.SCROLL, Events.calculation.READY_TO_READ);
    this.connectEvents(this.onCalculationCompleted.bind(this), Events.calculation.CALCULATION_COMPLETED);
  }

  _restoreCurrentOffset() {
    const { viewType } = Connector.setting.getSetting();
    const { position, contentIndex } = Connector.current.getCurrent();
    const startOffset = Connector.calculations.getStartOffset(contentIndex);
    const isCalculated = Connector.calculations.isContentCalculated(contentIndex)
      && startOffset !== PRE_CALCULATION;
    if (!isCalculated) return null;
    const calculationTotal = Connector.calculations.getCalculationsTotal();

    const total = Connector.calculations.getContentTotal(contentIndex);
    const newOffset = Math.round(position * total) + startOffset;

    console.log(`restore: ${contentIndex} index, ${calculationTotal}, ${screenHeight()}, ${position}, ${total}, ${startOffset}, ${newOffset}`);
    if (calculationTotal >= screenHeight() + newOffset) {
      this.isRestored = true;
      Connector.current.updateCurrent({ offset: newOffset, viewType });
      return newOffset;
    }
    return null;
  }

  _getCurrentOffset(offset) {
    const { viewType } = Connector.setting.getSetting();
    const contentIndex = CalculationsConnector.getIndexAtOffset(offset);
    const total = CalculationsConnector.getContentTotal(contentIndex);
    const position = (offset - CalculationsConnector.getStartOffset(contentIndex)) / total;
    let location = EMPTY_READ_LOCATION;
    try {
      location = ReaderJsHelper.get(contentIndex).getNodeLocationOfCurrentPage();
    } catch (e) {
      // ignore error
      console.warn(e);
    }

    return {
      contentIndex,
      offset,
      position,
      location,
      viewType,
    };
  }

  _getContentIndexesInOffsetRange(startOffset, endOffset) {
    const total = Connector.calculations.getCalculationsTotal();
    const calculations = Connector.calculations.getContentCalculations();
    const range = [startOffset, endOffset];

    const lastIndex = calculations.length;
    if (Connector.calculations.isCompleted() && startOffset > total) {
      // 가끔 리사이즈로 창 사이즈를 늘렸을 때 scrollTop(offset) 값이
      // 화면에 존재하지 않는 큰 값이 되는 경우가 있다.
      return [lastIndex];
    }

    return calculations.filter(({ index, total: contentTotal, isCalculated }) => {
      const offset = Connector.calculations.getStartOffset(index);
      if (!isCalculated || offset === PRE_CALCULATION) return false;
      const contentRange = [offset, index === FOOTER_INDEX ? total : offset + contentTotal];
      return hasIntersect(range, contentRange);
    }).map(({ index }) => index);
  }

  onCalculationInvalidated(invalidate$) {
    return invalidate$.subscribe(() => { this.isRestored = false; });
  }

  onCalculated(calculateUpdate$) {
    return calculateUpdate$.pipe(
      filter(() => !this.isRestored),
      map(() => this._restoreCurrentOffset()),
      tap(offset => Logger.debug('restored: ', offset)),
      filter(offset => offset !== null),
      tap(offset => EventBus.emit(Events.core.MOVE_TO_OFFSET, offset)),
      tap(() => { this.isRestored = true; }),
      tap(() => Connector.calculations.setReadyToRead()),
      tap(() => EventBus.emit(Events.calculation.READY_TO_READ)),
    ).subscribe();
  }

  onCalculationCompleted(calculationComplete$) {
    return calculationComplete$.pipe(
      filter(() => Connector.calculations.isReadyToRead()),
      tap(() => Connector.calculations.setReadyToRead()),
      tap(() => EventBus.emit(Events.calculation.READY_TO_READ)),
    ).subscribe();
  }

  onCurrentUpdated(scroll$, readyToRead$) {
    const currentUpdated$ = merge(
      scroll$.pipe(
        filter(() => this.isRestored),
        debounce(() => timer(DOMEventDelayConstants.SCROLL)),
        map(() => scrollTop()),
        distinctUntilChanged(),
        map(scrollY => this._getCurrentOffset(scrollY)),
        tap(current => Connector.current.updateCurrent(current)),
      ),
      readyToRead$.pipe(
        map(() => Connector.current.getCurrent()),
      ),
    );
    return currentUpdated$.pipe(
      tap(current => Logger.debug('currentUpdated$', current)),
      map(({ offset }) => ({ viewPortRange: [offset, offset + screenHeight()], margin: screenHeight() * 2 })),
      map(({ viewPortRange, margin }) => this._getContentIndexesInOffsetRange(
        viewPortRange[0] - margin, viewPortRange[1] + margin,
      )),
      tap(contentIndexes => Connector.content.setContentsInScreen(contentIndexes)),
    ).subscribe();
  }
}

export default new CurrentService();

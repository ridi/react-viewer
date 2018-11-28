import { map, filter, tap, debounce, distinctUntilChanged, scan, mergeMap } from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import CalculationsConnector from './connector/CalculationsConnector';
import SettingConnector from './connector/SettingConnector';
import { EMPTY_READ_LOCATION } from '..';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import { screenHeight, scrollLeft, scrollTop } from '../util/BrowserWrapper';
import Logger from '../util/Logger';
import { timer } from 'rxjs';
import DOMEventDelayConstants from '../constants/DOMEventDelayConstants';

class CurrentService extends BaseService {
  isRestored = false;

  load() {
    super.load();
    this.connectEvents(this.onCalculationInvalidated.bind(this), Events.calculation.CALCULATION_INVALIDATED);
    this.connectEvents(this.onCalculated.bind(this), Events.calculation.CALCULATION_UPDATED);
    this.connectEvents(this.onScrolled.bind(this), Events.core.SCROLL);
    this.connectEvents(this.onCalculationCompleted.bind(this), Events.calculation.CALCULATION_COMPLETED);
  }

  _restoreCurrentOffset() {
    const { viewType } = Connector.setting.getSetting();
    const { position, contentIndex } = Connector.current.getCurrent();
    const calculationTotal = Connector.calculations.getCalculationsTotal();

    const total = Connector.calculations.getContentTotal(contentIndex);
    const maxOffset = Connector.calculations.getStartOffset(contentIndex) + (total - 1);
    const newOffset = Math.min(Math.round(position * total) + Connector.calculations.getStartOffset(contentIndex), maxOffset);
    // TODO 깔끔하게 만들기
    console.log(`restore: ${calculationTotal}, ${screenHeight()}, ${newOffset}`);
    if (calculationTotal >= screenHeight() + newOffset) {
      this.isRestored = true;
      Connector.current.updateCurrent({ offset: newOffset, viewType });
      return newOffset;
    }
    return null;
  }

  _updateCurrentOffset(viewType, offset) {
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

    // TODO Replace this with emitting store event
    Connector.current.updateCurrent({
      contentIndex,
      offset,
      position,
      location,
      viewType,
    });
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

  onCalculationCompleted() {
  }

  onScrolled(scroll$) {
    return scroll$.pipe(
      debounce(() => timer(DOMEventDelayConstants.SCROLL)),
      map(() => ({ scrollX: scrollLeft(), scrollY: scrollTop() })),
      distinctUntilChanged(),
    ).subscribe();
  }
}

export default new CurrentService();

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
import { EMPTY_READ_LOCATION, ViewType } from '../constants/SettingConstants';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import { screenHeight, scrollTop, waitThenRun } from '../util/BrowserWrapper';
import Logger from '../util/Logger';
import DOMEventDelayConstants from '../constants/DOMEventDelayConstants';
import { FOOTER_INDEX, PRE_CALCULATION } from '../constants/CalculationsConstants';
import { hasIntersect } from '../util/Util';

class CurrentService extends BaseService {
  _isOffsetRestored = false;

  load() {
    super.load();

    this.connectEvents(this.onCalculationInvalidated.bind(this), Events.calculation.CALCULATION_INVALIDATED);
    this.connectEvents(this.onCalculated.bind(this), Events.calculation.CALCULATION_UPDATED, Events.calculation.CALCULATION_COMPLETED);
    this.connectEvents(this.onCurrentUpdated.bind(this), Events.core.UPDATE_CURRENT, Events.core.SCROLL);
    this.connectEvents(this.onMoved.bind(this), Events.core.MOVED);
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

    if (viewType === ViewType.PAGE || calculationTotal >= screenHeight() + newOffset) {
      this._isOffsetRestored = true;
      Connector.current.updateCurrent({ offset: newOffset, viewType });
      EventBus.emit(Events.core.UPDATE_CURRENT, { offset: newOffset, viewType });
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
    return invalidate$.subscribe(() => { this._isOffsetRestored = false; });
  }

  onCalculated(calculateUpdate$, calculationComplete$) {
    return merge(calculateUpdate$, calculationComplete$).pipe(
      filter(() => !this._isOffsetRestored),
    ).subscribe(() => {
      if (this._restoreCurrentOffset() !== null) {
        this._isOffsetRestored = true;
      }
    });
  }

  onCurrentUpdated(updateCurrent$, scroll$) {
    return merge(
      updateCurrent$.pipe(
        map(({ data: current }) => current),
        filter(({ offset }) => offset !== null),
        tap(({ offset }) => {
          Connector.calculations.setReadyToRead(false);
          waitThenRun(() => {
            EventBus.emit(Events.core.MOVE_TO_OFFSET, offset);
          }, 0);
        }),
      ),
      scroll$.pipe(
        filter(() => Connector.calculations.isReadyToRead()),
        debounce(() => timer(DOMEventDelayConstants.SCROLL)),
        map(() => scrollTop()),
        tap(top => Logger.debug('scrollTop', top)),
        distinctUntilChanged(),
        map(scrollY => this._getCurrentOffset(scrollY)),
        tap(current => Connector.current.updateCurrent(current)),
      ),
    ).subscribe(({ offset, contentIndex }) => {
      const { viewType } = Connector.setting.getSetting();
      if (viewType === ViewType.SCROLL) {
        const viewPortRange = [offset, offset + screenHeight()];
        const margin = screenHeight() * 2;
        const contentIndexes = this._getContentIndexesInOffsetRange(
          viewPortRange[0] - margin, viewPortRange[1] + margin,
        );
        Logger.debug('setContentsInScreen', contentIndexes);
        Connector.content.setContentsInScreen(contentIndexes);
      } else {
        Connector.content.setContentsInScreen([contentIndex]);
      }
    });
  }

  onMoved(moved$) {
    return moved$.subscribe(() => {
      Connector.calculations.setReadyToRead(true);
      waitThenRun(() => EventBus.emit(Events.calculation.READY_TO_READ), 0);
    });
  }
}

export default new CurrentService();

import { timer, NEVER, merge } from 'rxjs';
import {
  tap,
  map,
  filter,
  debounce,
  distinctUntilChanged,
  catchError,
  mergeMap,
} from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import { ViewType } from '../constants/SettingConstants';
import { screenHeight, scrollLeft, scrollTop } from '../util/BrowserWrapper';
import Logger from '../util/Logger';
import DOMEventDelayConstants from '../constants/DOMEventDelayConstants';
import { FOOTER_INDEX } from '../constants/CalculationsConstants';
import { hasIntersect } from '../util/Util';

class CurrentService extends BaseService {
  _isOffsetRestored = false;

  load() {
    super.load();

    this.connectEvents(this.onCalculationInvalidated.bind(this), Events.CALCULATION_INVALIDATED);
    this.connectEvents(this.onCalculated.bind(this), Events.CALCULATION_UPDATED, Events.CALCULATIONS_SET);
    this.connectEvents(this.onCalculationCompleted.bind(this), Events.CALCULATION_COMPLETED);
    this.connectEvents(this.onCurrentOffsetUpdated.bind(this), Events.UPDATE_CURRENT_OFFSET);
    this.connectEvents(this.onScrolled.bind(this), Events.SCROLL);
    this.connectEvents(this.onMoved.bind(this), Events.MOVED);
  }

  _restoreCurrentOffset() {
    const { position, contentIndex } = Connector.current.getCurrent();
    const { offset, total, isCalculated } = Connector.calculations.getCalculation(contentIndex);

    if (!isCalculated) return null;

    const { viewType } = Connector.setting.getSetting();
    const calculationTotal = Connector.calculations.getCalculationsTotal();
    const newOffset = Math.min(total - 1, Math.round(position * total)) + offset;

    if ((viewType === ViewType.PAGE)
      || (viewType === ViewType.SCROLL && calculationTotal >= screenHeight() + newOffset)) {
      this._isOffsetRestored = true;
      EventBus.emit(Events.UPDATE_CURRENT_OFFSET, newOffset);
      return newOffset;
    }
    return null;
  }

  _getCurrent(offset) {
    const { viewType } = Connector.setting.getSetting();
    const { contentIndex, position } = Connector.calculations.getContentIndexAndPositionAtOffset(offset);
    if (contentIndex === null || position === null) return null;

    const offsetEnd = offset + (viewType === ViewType.SCROLL ? screenHeight() : 1);
    let end = Connector.calculations.getContentIndexAndPositionAtOffset(offsetEnd);

    if (end.contentIndex === null) {
      end = { contentIndex: contentIndex + 1, position: 0 };
    }

    return {
      contentIndex,
      offset: Math.round(offset),
      position,
      // location,
      viewType,
      viewPortRange: [{ contentIndex, position }, end],
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

    return calculations.filter(({
      index,
      offset,
      total: contentTotal,
      isCalculated,
    }) => {
      if (!isCalculated) return false;
      const contentRange = [offset, index === FOOTER_INDEX ? total : offset + contentTotal];
      return hasIntersect(range, contentRange);
    }).map(({ index }) => index);
  }

  _setContentsInScreen({ offset, contentIndex }) {
    const { viewType } = Connector.setting.getSetting();
    if (viewType === ViewType.SCROLL) {
      const viewPortRange = [offset, offset + screenHeight()];
      const margin = screenHeight() * 2;
      const contentIndexes = this._getContentIndexesInOffsetRange(
        viewPortRange[0] - margin, viewPortRange[1] + margin,
      );
      Connector.content.setContentsInScreen(contentIndexes);
    } else {
      Connector.content.setContentsInScreen([contentIndex]);
    }
  }

  onCalculationInvalidated(invalidate$) {
    return invalidate$.subscribe(() => {
      this._isOffsetRestored = false;
    });
  }

  onCalculated(calculateUpdate$, calculationsSet$) {
    return merge(
      calculateUpdate$.pipe(
        filter(() => !this._isOffsetRestored),
      ),
      calculationsSet$.pipe(
        mergeMap(() => timer()),
      ),
    ).subscribe(() => {
      if (this._restoreCurrentOffset() !== null) {
        this._isOffsetRestored = true;
      }
      if (!Connector.calculations.isReadyToRead()) {
        Connector.calculations.setReadyToRead(true);
        EventBus.emit(Events.READY_TO_READ);
      }
    });
  }

  onCalculationCompleted(calculationComplete$) {
    return calculationComplete$.subscribe(() => {
      if (!this._isOffsetRestored) {
        if (this._restoreCurrentOffset() !== null) {
          this._isOffsetRestored = true;
        }
      }
      if (!Connector.calculations.isReadyToRead()) {
        Connector.calculations.setReadyToRead(true);
        EventBus.emit(Events.READY_TO_READ);
      }
    });
  }

  onCurrentOffsetUpdated(updateCurrentOffset$) {
    return updateCurrentOffset$.pipe(
      filter(({ data: offset }) => offset !== null),
      map(({ data: offset }) => this._getCurrent(offset)),
      filter(current => !!current),
      catchError((err, caught) => {
        Logger.error(err, caught);
        return NEVER;
      }),
    ).subscribe((current) => {
      Connector.current.updateCurrent(current);
      Connector.calculations.setReadyToRead(false);
      this._setContentsInScreen(current);
      EventBus.emit(Events.MOVE_TO_OFFSET, current.offset);
    });
  }

  onScrolled(scroll$) {
    return scroll$.pipe(
      filter(() => Connector.calculations.isReadyToRead()),
      debounce(() => timer(DOMEventDelayConstants.SCROLL)),
      map(() => ({ scrollX: scrollLeft(), scrollY: scrollTop() })),
      tap(({ scrollX, scrollY }) => EventBus.emit(Events.SCROLL_DEBOUNCED, { scrollX, scrollY })),
      map(({ scrollY }) => this._getCurrent(scrollY)),
      filter(current => !!current),
      distinctUntilChanged((x, y) => x.offset === y.offset && x.viewType === y.viewType),
      catchError((err, caught) => {
        Logger.error(err, caught);
        return NEVER;
      }),
    ).subscribe((current) => {
      Connector.current.updateCurrent(current);
      this._setContentsInScreen(current);
    });
  }

  onMoved(move$) {
    return move$.subscribe(() => {
      if (!Connector.calculations.isReadyToRead()) {
        Connector.calculations.setReadyToRead(true);
        EventBus.emit(Events.READY_TO_READ);
      }
    });
  }
}

export default new CurrentService();

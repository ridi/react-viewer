import { merge, timer, NEVER } from 'rxjs';
import {
  map,
  filter,
  debounce,
  distinctUntilChanged,
  catchError,
} from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import { ViewType } from '../constants/SettingConstants';
import { screenHeight, scrollTop } from '../util/BrowserWrapper';
import Logger from '../util/Logger';
import DOMEventDelayConstants from '../constants/DOMEventDelayConstants';
import { FOOTER_INDEX, PRE_CALCULATION } from '../constants/CalculationsConstants';
import { hasIntersect } from '../util/Util';
import AnnotationStore from '../store/AnnotationStore';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import { RectsUtil } from '../util/SelectionUtil';

class CurrentService extends BaseService {
  _isOffsetRestored = false;

  load() {
    super.load();

    this.connectEvents(this.onCalculationInvalidated.bind(this), Events.CALCULATION_INVALIDATED);
    this.connectEvents(this.onCalculated.bind(this), Events.CALCULATION_UPDATED);
    this.connectEvents(this.onCalculationCompleted.bind(this), Events.CALCULATION_COMPLETED);
    this.connectEvents(this.onCurrentUpdated.bind(this), Events.UPDATE_CURRENT_OFFSET);
    this.connectEvents(this.onScrolled.bind(this), Events.SCROLL);
    this.connectEvents(this.onMoved.bind(this), Events.MOVED);
    this.connectEvents(this.onAnnotationCalculationNeeded.bind(this), Events.SCROLL, Events.MOVED, Events.ANNOTATION_ADDED);
    this.connectEvents(this.onAnnotationsSet.bind(this), Events.SET_ANNOTATIONS);
  }

  _restoreCurrentOffset() {
    const { position, contentIndex } = Connector.current.getCurrent();
    const { offset, total, isCalculated } = Connector.calculations.getCalculation(contentIndex);

    if (!isCalculated || offset === PRE_CALCULATION) return null;

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
    const end = Connector.calculations.getContentIndexAndPositionAtOffset(offsetEnd);

    // let location = EMPTY_READ_LOCATION;
    // try {
    //   location = ReaderJsHelper.get(contentIndex).getNodeLocationOfCurrentPage();
    // } catch (e) {
    //   // ignore erro
    //   console.warn(e);
    // }

    return {
      contentIndex,
      offset,
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

    return calculations.filter(({ index, total: contentTotal, isCalculated }) => {
      const offset = Connector.calculations.getStartOffset(index);
      if (!isCalculated || offset === PRE_CALCULATION) return false;
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
      AnnotationStore.invalidateCalculations();
    });
  }

  onCalculated(calculateUpdate$) {
    return calculateUpdate$.pipe(
      filter(() => !this._isOffsetRestored),
    ).subscribe(() => {
      if (this._restoreCurrentOffset() !== null) {
        this._isOffsetRestored = true;
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

  onCurrentUpdated(updateCurrentOffset$) {
    return updateCurrentOffset$.pipe(
      filter(({ data: offset }) => offset !== null),
      map(({ data: offset }) => this._getCurrent(offset)),
      filter(current => current),
      distinctUntilChanged((x, y) => x.offset === y.offset && x.viewType === y.viewType),
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
      map(() => scrollTop()),
      map(scrollY => this._getCurrent(scrollY)),
      distinctUntilChanged((x, y) => x.offset === y.offset && x.viewType === y.viewType),
    ).subscribe((current) => {
      Connector.current.updateCurrent(current);
      this._setContentsInScreen(current);
    });
  }

  onMoved(move$) {
    return move$.subscribe(() => {
      Connector.calculations.setReadyToRead(true);
      EventBus.emit(Events.READY_TO_READ);
    });
  }

  _getRectsFromSerializedRange(contentIndex, serializedRange) {
    const { viewType } = Connector.setting.getSetting();

    let xAdded = 0;
    if (viewType === ViewType.PAGE) {
      const { offset, viewType: currentViewType } = Connector.current.getCurrent();
      if (currentViewType === ViewType.PAGE) {
        const containerWidth = Connector.setting.getContainerWidth();
        const columnGap = Connector.setting.getColumnGap();
        const { offset: startOffset } = Connector.calculations.getCalculation(contentIndex);
        const localOffset = offset - startOffset;
        xAdded = localOffset * (containerWidth + columnGap);
      }
    }

    let readerJs;
    try {
      readerJs = ReaderJsHelper.get(contentIndex);
      const rects = readerJs.getRectsFromSerializedRange(serializedRange);
      return new RectsUtil(rects)
        .toAbsolute()
        .translateX(viewType === ViewType.PAGE ? xAdded : 0)
        .getObject();
    } catch (e) {
      Logger.warn(e);
      return [];
    }
  }

  onAnnotationCalculationNeeded(scroll$, moved$, annotationAdded$) {
    return merge(
      scroll$,
      moved$,
      annotationAdded$,
    ).subscribe(() => {
      const contentIndexes = Connector.content.getContentsInScreen();

      const annotationsInScreen = AnnotationStore.annotations
        .filter(({ contentIndex: aci }) => contentIndexes.includes(aci));
      const calculationTargets = annotationsInScreen
        .filter(({ id }) => !AnnotationStore.calculations.has(id) || AnnotationStore.calculations.get(id).rects === null);

      AnnotationStore.setCalculations(
        calculationTargets.map(({ id, contentIndex, serializedRange }) => ({
          id,
          contentIndex,
          rects: this._getRectsFromSerializedRange(contentIndex, serializedRange),
        })),
        annotationsInScreen.map(({ id }) => id),
      );
    });
  }

  onAnnotationsSet(setAnnotation$) {
    return setAnnotation$.subscribe(({ data: annotations }) => {
      let added = false;
      if (AnnotationStore.annotations.length < annotations.length) {
        // annotation added
        added = true;
      }
      AnnotationStore.annotations = annotations;
      EventBus.emit(Events.ANNOTATION_CHANGED, annotations);
      if (added) {
        EventBus.emit(Events.ANNOTATION_ADDED);
      }
    });
  }

  toPageRelativeRects(rects) {
    const { viewType } = Connector.setting.getSetting();
    if (viewType !== ViewType.PAGE) return rects;

    const containerWidth = Connector.setting.getContainerWidth();
    const columnGap = Connector.setting.getColumnGap();
    const { offset, contentIndex } = Connector.current.getCurrent();
    const { offset: startOffset } = Connector.calculations.getCalculation(contentIndex);
    const localOffset = offset - startOffset;

    return rects.map(({ left, ...others }) => ({
      left: left - (localOffset * (containerWidth + columnGap)),
      ...others,
    }));
  }
}

export default new CurrentService();

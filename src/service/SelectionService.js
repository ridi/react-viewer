import { merge } from 'rxjs';
import {
  map, tap,
} from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import { ViewType } from '../constants/SettingConstants';
import Logger from '../util/Logger';
import AnnotationStore from '../store/AnnotationStore';
import ReaderJsHelper from './readerjs/ReaderJsHelper';
import { RectsUtil } from '../util/SelectionUtil';
import SelectionStore from '../store/SelectionStore';

class SelectionService extends BaseService {
  _isOffsetRestored = false;

  load() {
    super.load();
    this.connectEvents(this.onAnnotationCalculationNeeded.bind(this),
      Events.SCROLL_DEBOUNCED, Events.MOVED, Events.ANNOTATION_ADDED, Events.SET_ANNOTATIONS);
    this.connectEvents(this.onAnnotationsSet.bind(this),
      Events.SET_ANNOTATIONS, Events.ADD_ANNOTATION, Events.UPDATE_ANNOTATION, Events.REMOVE_ANNOTATION);
    this.connectEvents(this.onSelectionEnd.bind(this), Events.END_SELECTION);
  }

  _getRectsFromSerializedRange(contentIndex, serializedRange) {
    let readerJs;
    try {
      readerJs = ReaderJsHelper.get(contentIndex);
      const rects = readerJs.getRectsFromSerializedRange(serializedRange);
      return new RectsUtil(rects)
        .toAbsolute()
        .translateX(Connector.current.getLeftOffset())
        .build();
    } catch (e) {
      Logger.warn(e);
      return [];
    }
  }

  onAnnotationCalculationNeeded(scrollDebounced$, moved$, annotationAdded$, annotationSet$) {
    return merge(
      scrollDebounced$,
      moved$,
      annotationAdded$,
      annotationSet$.pipe(tap(() => AnnotationStore.invalidateCalculations())),
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

  onAnnotationsSet(setAnnotations$, addAnnotation$, updateAnnotation$, removeAnnotation$) {
    return merge(
      setAnnotations$.pipe(
        map(({ data }) => data),
      ),
      addAnnotation$.pipe(
        map(({ data }) => data),
        map(data => [...AnnotationStore.annotations, data]),
      ),
      updateAnnotation$.pipe(
        map(({ data }) => data),
        map(data => AnnotationStore.annotations.map(item => ((item.id === data.id) ? { ...item, ...data } : item))),
      ),
      removeAnnotation$.pipe(
        map(({ data }) => data),
        map((data) => {
          const clone = [...AnnotationStore.annotations];
          const index = clone.findIndex(item => item.id === data.id);
          if (index > -1) {
            clone.splice(clone.findIndex(item => item.id === data.id), 1);
          }
          return clone;
        }),
      ),
    ).subscribe((annotations) => {
      const added = AnnotationStore.annotations.length < annotations.length;
      AnnotationStore.annotations = annotations;
      EventBus.emit(Events.ANNOTATION_CHANGED, annotations);
      if (added) {
        EventBus.emit(Events.ANNOTATION_ADDED);
      }
    });
  }

  onSelectionEnd(endSelection$) {
    return endSelection$.subscribe(() => SelectionStore.end());
  }

  toPageRelativeRects(rects) {
    const { viewType } = Connector.setting.getSetting();
    if (viewType !== ViewType.PAGE) return rects;

    return rects.map(({ left, ...others }) => ({
      left: left - Connector.current.getLeftOffset(),
      ...others,
    }));
  }
}

export default new SelectionService();

/* eslint no-param-reassign: 0 */
import { BehaviorSubject } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import Logger from '../util/Logger';

class AnnotationStore {
  _annotations = [];
  _calculations = new Map();
  _subject = (new BehaviorSubject(this._calculations)).pipe(
    tap(data => Logger.debugGroup(`📥 ${this.constructor.name}`, data)),
    share(),
  );

  get annotations() {
    return this._annotations;
  }

  set annotations(annotations) {
    this._annotations = annotations;
  }

  get calculations() {
    return this._calculations;
  }

  asObservable() {
    return this._subject;
  }

  next(data) {
    this._subject.next(data);
  }

  invalidateCalculations() {
    this._calculations.clear();
    this._subject.next(this.getData());
  }

  getCalculation(id) {
    if (!this._calculations.has(id)) {
      this._calculations.set(id, {
        id,
        rects: null,
        isVisible: false,
      });
    }
    this._calculations.get(id);
  }

  setCalculations(calculations, visibleIds) {
    calculations.forEach((updatedCalculation) => {
      const originalCalculation = this.getCalculation(updatedCalculation.id);
      this._calculations.set(updatedCalculation.id, {
        ...originalCalculation,
        ...updatedCalculation,
        isVisible: visibleIds.includes(updatedCalculation.id),
      });
    });
    this._subject.next(this.getData());
    // EventBus.emit(Events.core.ANNOTATION_CALCULATIONS_CHANGED, this._calculations);
  }

  getData() {
    return this._annotations
      .filter(({ id }) => this._calculations.has(id) && this._calculations.get(id).isVisible)
      .map(annotation => ({ ...annotation, ...this._calculations.get(annotation.id) }));
  }
}

export default new AnnotationStore();

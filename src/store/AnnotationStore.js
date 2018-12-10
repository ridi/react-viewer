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
    this._subject.next(this.getData());
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
    return this._calculations.get(id);
  }

  setCalculations(calculations, visibleIds) {
    calculations.forEach((updatedCalculation) => {
      const originalCalculation = this.getCalculation(updatedCalculation.id);
      this._calculations.set(updatedCalculation.id, {
        ...originalCalculation,
        ...updatedCalculation,
      });
    });
    this._calculations.forEach((originalCalculation, id) => {
      this._calculations.set(id, {
        ...originalCalculation,
        isVisible: visibleIds.includes(id),
      });
    });
    this._subject.next(this.getData());
  }

  getData() {
    return this._annotations
      .filter(({ id }) => this._calculations.has(id) && this._calculations.get(id).isVisible)
      .map(annotation => ({ ...annotation, ...this._calculations.get(annotation.id) }));
  }
}

export default new AnnotationStore();

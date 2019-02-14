/* eslint no-param-reassign: 0 */
import BaseStore from './BaseStore';
import Connector from '../service/connector';

class AnnotationStore extends BaseStore {
  _annotations = [];
  _calculations = new Map();

  constructor() {
    super([]);
  }

  get annotations() {
    return this._annotations;
  }

  set annotations(annotations) {
    this._annotations = annotations;
    // todo improve
    this._calculations.forEach((cal) => {
      if (!annotations.some(({ id }) => id === cal.id)) {
        this._calculations.delete(cal.id);
      }
    });
    this.next();
  }

  get calculations() {
    return this._calculations;
  }

  invalidateCalculations() {
    this._calculations.clear();
    this.next();
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
    this.next();
  }

  getData() {
    return this._annotations
      .filter(({ id }) => this._calculations.has(id) && this._calculations.get(id).isVisible)
      .map(annotation => ({ ...annotation, ...this._calculations.get(annotation.id) }));
  }

  getByPoint(x, y) {
    const leftOffset = Connector.current.getLeftOffset();
    const calculation = Array.from(this._calculations.values())
      .find(({ rects }) => rects.some(rect => rect.contains(x + leftOffset, y)));
    if (!calculation) return null;
    const annotation = this._annotations.find(({ id }) => id === calculation.id);
    if (!annotation) return null;
    return { ...annotation, ...calculation };
  }
}

export default new AnnotationStore();

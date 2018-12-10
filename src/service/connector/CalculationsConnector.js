import BaseConnector from './BaseConnector';
import {
  updateCalculationsTotal,
  invalidateCalculations,
  updateFooterCalculation,
  updateContentCalculation,
  setReadyToRead,
  setCalculationsTargets,
  setCalculations,
} from '../../redux/action';
import {
  selectReaderFooterCalculations,
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderIsAllCalculated,
  selectReaderIsInitContents,
  selectReaderContents,
  selectReaderIsReadyToRead,
} from '../../redux/selector';
import { FOOTER_INDEX } from '../../constants/CalculationsConstants';
import SelectionConnector from './SelectionConnector';

class CalculationsConnector extends BaseConnector {
  // todo move to config
  _hasFooter = false;

  set hasFooter(hasFooter) {
    this._hasFooter = hasFooter;
  }

  get hasFooter() {
    return this._hasFooter;
  }

  invalidate() {
    this.dispatch(invalidateCalculations());
  }

  isCompleted() {
    return selectReaderIsAllCalculated(this.getState());
  }

  isContentCalculated(index) {
    return this.getCalculation(index).isCalculated;
  }

  getCalculation(index) {
    if (index === FOOTER_INDEX) {
      return selectReaderFooterCalculations(this.getState());
    }
    if (!selectReaderIsInitContents(this.getState())) return false;
    const calculatedContents = this.getContentCalculations();
    return calculatedContents[index - 1];
  }

  getContentCalculations() {
    return selectReaderContentsCalculations(this.getState());
  }

  getFooterCalculations() {
    return selectReaderFooterCalculations(this.getState());
  }

  getStartOffset(index) {
    return this.getCalculation(index).offset;
  }

  setStartOffset(index, offset) {
    if (index === FOOTER_INDEX) {
      this.dispatch(updateFooterCalculation({ offset }));
    } else {
      const calculationOffset = this.getStartOffset(index);
      if (calculationOffset !== offset) {
        this.dispatch(updateContentCalculation({ index, offset }));
      }
    }
  }

  setReadyToRead(readyToRead = true) {
    this.dispatch(setReadyToRead(readyToRead));
  }

  isReadyToRead() {
    return selectReaderIsReadyToRead(this.getState());
  }

  setContentTotal(index, total) {
    if (!this.isContentCalculated(index)) {
      this.dispatch(index === FOOTER_INDEX
        ? updateFooterCalculation({ total, isCalculated: true })
        : updateContentCalculation({ index, total, isCalculated: true }));
    }
  }

  setCalculationsTotal(calculatedTotal, completed) {
    this.dispatch(updateCalculationsTotal(calculatedTotal, completed));
  }

  getContentTotal(index) {
    return this.getCalculation(index).total;
  }

  getCalculationsTotal() {
    const { total: footerTotal } = this.getFooterCalculations();
    return selectReaderCalculationsTotal(this.getState()) + footerTotal;
  }

  isLastContent(index) {
    const calculatedContents = selectReaderContents(this.getState());
    return index === calculatedContents.length;
  }

  getAnnotationCalculation(annotation) {
    return {
      rects: SelectionConnector.getRectsFromSerializedRange(annotation.contentIndex, annotation.serializedRange),
    };
  }

  setTargets(targets) {
    this.dispatch(setCalculationsTargets(targets));
  }

  setCalculations(calculations) {
    this.dispatch(setCalculations(calculations));
  }
}

export default new CalculationsConnector();

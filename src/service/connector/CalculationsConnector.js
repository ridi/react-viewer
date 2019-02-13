import BaseConnector from './BaseConnector';
import {
  invalidateCalculations,
  setCalculations,
  setCalculationsTargets,
  setReadyToRead,
  updateCalculationsTotal,
  updateContentCalculation,
  updateFooterCalculation,
} from '../../redux/action';
import {
  selectReaderCalculationsTotal,
  selectReaderContents,
  selectReaderContentsCalculations,
  selectReaderFooterCalculations,
  selectReaderIsAllCalculated,
  selectReaderIsInitContents,
  selectReaderIsReadyToRead,
} from '../../redux/selector';
import { FOOTER_INDEX, PRE_CALCULATION } from '../../constants/CalculationsConstants';
import SettingConnector from './SettingConnector';

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
    const { startWithBlankPage, columnsInPage } = SettingConnector.getSetting();
    this.dispatch(invalidateCalculations(startWithBlankPage / columnsInPage));
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
    const { total, isCalculated } = this.getCalculation(index);
    if (isCalculated) return;
    this.dispatch(index === FOOTER_INDEX
      ? updateFooterCalculation({ offset, isCalculated: total !== PRE_CALCULATION })
      : updateContentCalculation({ index, offset, isCalculated: total !== PRE_CALCULATION }));
  }

  setReadyToRead(readyToRead = true) {
    this.dispatch(setReadyToRead(readyToRead));
  }

  isReadyToRead() {
    return selectReaderIsReadyToRead(this.getState());
  }

  setContentTotal(index, total) {
    const { offset, isCalculated } = this.getCalculation(index);
    if (isCalculated) return;
    this.dispatch(index === FOOTER_INDEX
      ? updateFooterCalculation({ total, isCalculated: offset !== PRE_CALCULATION })
      : updateContentCalculation({ index, total, isCalculated: offset !== PRE_CALCULATION }));
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

  setTargets(targets) {
    this.dispatch(setCalculationsTargets(targets));
  }

  setCalculations(calculations) {
    const { contents, footer, contentTotal } = calculations;
    const isCompleted = contents.every(cal => cal.isCalculated)
      && (!this.hasFooter || (footer && footer.isCalculated));
    this.dispatch(setCalculations(calculations));

    if (isCompleted) {
      this.setCalculationsTotal(contentTotal, isCompleted);
    }
  }

  getContentIndexAndPositionAtOffset(offset) {
    const calculations = this.getContentCalculations();
    const lastIndex = calculations.length;

    let contentIndex = null;
    let position = null;

    calculations.forEach(({
      offset: startOffset,
      total,
      isCalculated,
      index,
    }) => {
      if (!isCalculated) {
        return;
      }
      if (offset >= startOffset && offset < startOffset + total) {
        contentIndex = index;
        return;
      }
      if (index === lastIndex && offset >= startOffset + total) {
        contentIndex = FOOTER_INDEX;
      }
    });

    if (contentIndex !== null) {
      const { offset: startOffset, total } = this.getCalculation(contentIndex);
      position = (offset - startOffset) / total;
    }
    return { contentIndex, position };
  }
}

export default new CalculationsConnector();

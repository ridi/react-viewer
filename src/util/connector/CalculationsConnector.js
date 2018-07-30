import Connector from '../Connector';
import {
  updateCalculationsTotal,
  invalidateCalculations,
  updateCurrent,
  updateFooterCalculation,
  updateContentCalculations,
} from '../../redux/action';
import {
  selectReaderFooterCalculations,
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderCurrent,
  selectReaderCurrentContentIndex,
  selectReaderIsCalculated,
  selectReaderSetting,
  selectReaderContentFormat,
  selectReaderIsInitContents,
  selectReaderContents,
} from '../../redux/selector';
import { hasIntersect } from '../Util';
import { ContentFormat } from '../../constants/ContentConstants';
import { FOOTER_INDEX, PRE_CALCULATION } from '../../constants/CalculationsConstants';

// TODO 테스트 작성
class CalculationsConnector extends Connector {
  constructor() {
    super();
    this.startOffset = { 1: 0 };
    this.hasFooter = false;
  }

  setHasFooter(hasFooter) {
    this.hasFooter = hasFooter;
  }

  invalidate() {
    this.startOffset = { 1: 0 };
    this.dispatch(invalidateCalculations());
  }

  isCompleted() {
    return selectReaderIsCalculated(this.getState());
  }

  isCalculated(index) {
    if (index === FOOTER_INDEX) {
      const calculatedFooter = selectReaderFooterCalculations(this.getState());
      return calculatedFooter.isCalculated;
    }
    const calculatedContents = selectReaderContentsCalculations(this.getState());
    return calculatedContents[index - 1].isCalculated;
  }

  checkComplete() {
    const isInitContents = selectReaderIsInitContents(this.getState());
    if (!isInitContents) return;
    const calculatedContents = selectReaderContentsCalculations(this.getState());
    const calculatedFooter = selectReaderFooterCalculations(this.getState());
    const contentFormat = selectReaderContentFormat(this.getState());
    const isAllCalculated = contentFormat === ContentFormat.HTML
      ? calculatedContents.every(content => content.isCalculated)
      : calculatedContents[0].isCalculated;
    const isFooterCalculated = !this.hasFooter || calculatedFooter.isCalculated;

    for (let i = 0; i < calculatedContents.length; i += 1) {
      const { index, isCalculated, total } = calculatedContents[i];
      if (isCalculated && typeof this.startOffset[index] === 'number') {
        const nextIndex = (index === calculatedContents.length) ? FOOTER_INDEX : index + 1;
        this.startOffset[nextIndex] = this.startOffset[index] + total;
      } else {
        break;
      }
    }

    const calculatedTotal = calculatedContents.reduce((sum, content) => sum + content.total, calculatedFooter.total);
    this.dispatch(updateCalculationsTotal(calculatedTotal, isAllCalculated && isFooterCalculated));
  }

  setTotal(index, total) {
    if (!this.isCalculated(index)) {
      this.dispatch(index === FOOTER_INDEX ? updateFooterCalculation(total) : updateContentCalculations(index, total));
      this.checkComplete();
    }
  }

  getTotal(index) {
    if (index === FOOTER_INDEX) {
      const { total } = selectReaderFooterCalculations(this.getState());
      return total;
    }
    const calculatedContents = selectReaderContentsCalculations(this.getState());
    return calculatedContents[index - 1].total;
  }

  getStartOffset(index) {
    return typeof this.startOffset[index] === 'number' ? this.startOffset[index] : PRE_CALCULATION;
  }

  getContentIndexesInOffsetRange(startOffset, endOffset) {
    const total = selectReaderCalculationsTotal(this.getState());
    const calculations = selectReaderContentsCalculations(this.getState());
    const result = [];
    const range = [startOffset, endOffset];

    const lastIndex = calculations.length;
    if (this.isCompleted() && startOffset > total) {
      // 가끔 리사이즈로 창 사이즈를 늘렸을 때 scrollTop(offset) 값이
      // 화면에 존재하지 않는 큰 값이 되는 경우가 있다.
      return [lastIndex];
    }

    for (let i = 1; i <= lastIndex; i += 1) {
      const index = i === lastIndex + 1 ? FOOTER_INDEX : i;
      const nextIndex = i === lastIndex ? FOOTER_INDEX : i + 1;
      if (typeof this.startOffset[nextIndex] === 'undefined') {
        break;
      }
      const contentRange = [this.startOffset[index], index === FOOTER_INDEX ? total : this.startOffset[nextIndex]];
      if (hasIntersect(range, contentRange)) {
        result.push(index);
      } else if (this.startOffset[index] > endOffset) {
        break;
      }
    }

    return result;
  }

  getIndexAtOffset(offset) {
    if (!this.isCompleted()) return null;

    const lastIndex = Object.keys(this.startOffset).length;
    for (let i = 1; i <= lastIndex; i += 1) {
      const index = i === lastIndex ? FOOTER_INDEX : i;
      const nextIndex = i >= lastIndex - 1 ? FOOTER_INDEX : i + 1;
      // index === lastIndex ==> isFooter
      if (offset >= this.startOffset[index] && (index === FOOTER_INDEX || offset < this.startOffset[nextIndex])) {
        return index;
      }
    }
    return null;
  }

  updateCurrentPosition(offset) {
    // console.log('updateCurrentPosition');
    if (!this.isCompleted()) return;

    const { viewType } = selectReaderSetting(this.getState());
    const contentIndex = this.getIndexAtOffset(offset);

    const total = this.getTotal(contentIndex);
    // TODO 현재는 스파인 내 비율로 저장
    const position = (offset - this.startOffset[contentIndex]) / total;
    this.dispatch(updateCurrent({
      contentIndex,
      offset,
      position,
      viewType,
    }));
  }

  restoreCurrentOffset() {
    if (!this.isCompleted()) return;

    const { viewType } = selectReaderSetting(this.getState());
    const { position, contentIndex } = selectReaderCurrent(this.getState());

    const total = this.getTotal(contentIndex);
    const maxOffset = this.startOffset[contentIndex] + (total - 1);
    const offset = Math.min(Math.round(position * total) + this.startOffset[contentIndex], maxOffset);
    this.dispatch(updateCurrent({ offset, viewType }));
  }

  isOnFooter() {
    if (!this.hasFooter) return false;
    if (!this.isCompleted()) return false;

    const currentContentIndex = selectReaderCurrentContentIndex(this.getState());
    return currentContentIndex === FOOTER_INDEX;
  }

  isLastContent(index) {
    const calculatedContents = selectReaderContents(this.getState());
    return index === calculatedContents.length;
  }
}

export default new CalculationsConnector();

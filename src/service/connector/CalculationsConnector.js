import BaseConnector from './BaseConnector';
import {
  updateCalculationsTotal,
  invalidateCalculations,
  updateFooterCalculation,
  updateContentCalculation,
  setReadyToRead,
} from '../../redux/action';
import {
  selectReaderFooterCalculations,
  selectReaderContentsCalculations,
  selectReaderCalculationsTotal,
  selectReaderIsAllCalculated,
  selectReaderContentFormat,
  selectReaderIsInitContents,
  selectReaderContents,
  selectReaderCurrentContentIndex,
  selectReaderIsReadyToRead,
} from '../../redux/selector';
import { hasIntersect } from '../../util/Util';
import { ContentFormat } from '../../constants/ContentConstants';
import { FOOTER_INDEX, PRE_CALCULATION } from '../../constants/CalculationsConstants';

// TODO 테스트 작성
class CalculationsConnector extends BaseConnector {
  constructor() {
    super();
    this.hasFooter = false;
  }

  setHasFooter(hasFooter) {
    this.hasFooter = hasFooter;
  }

  getHasFooter() {
    return this.hasFooter;
  }

  invalidate() {
    this.dispatch(invalidateCalculations());
  }

  isCompleted() {
    return selectReaderIsAllCalculated(this.getState());
  }

  isContentCalculated(index) {
    if (index === FOOTER_INDEX) {
      const calculatedFooter = selectReaderFooterCalculations(this.getState());
      return calculatedFooter.isCalculated;
    }
    if (!selectReaderIsInitContents(this.getState())) return false;
    const calculatedContents = selectReaderContentsCalculations(this.getState());
    return calculatedContents[index - 1].isCalculated;
  }

  getCalculation(index) {
    if (index === FOOTER_INDEX) {
      return selectReaderFooterCalculations(this.getState());
    }
    if (!selectReaderIsInitContents(this.getState())) return false;
    const calculatedContents = selectReaderContentsCalculations(this.getState());
    return calculatedContents[index - 1];
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

  checkAllCompleted() {
    const state = this.getState();
    const isInitContents = selectReaderIsInitContents(state);
    if (!isInitContents) return;
    const calculatedContents = selectReaderContentsCalculations(state);
    const calculatedFooter = selectReaderFooterCalculations(state);
    const contentFormat = selectReaderContentFormat(state);
    const isAllCalculated = contentFormat === ContentFormat.HTML
      ? calculatedContents.every(content => content.isCalculated)
      : calculatedContents[0].isCalculated;
    const isFooterCalculated = !this.hasFooter || calculatedFooter.isCalculated;

    for (let i = 0; i < calculatedContents.length; i += 1) {
      const { index, isCalculated, total } = calculatedContents[i];
      if (isCalculated && typeof this.getStartOffset(index) === 'number') {
        const nextIndex = (index === calculatedContents.length) ? FOOTER_INDEX : index + 1;
        this.setStartOffset(nextIndex, this.getStartOffset(index) + total);
      } else {
        break;
      }
    }

    const calculatedTotal = calculatedContents.reduce((sum, content) => sum + content.total, calculatedFooter.total);
    this.dispatch(updateCalculationsTotal(calculatedTotal, isAllCalculated && isFooterCalculated));

    const isReadyToRead = selectReaderIsReadyToRead(state);
    if (!isReadyToRead) {
      const currentContentIndex = selectReaderCurrentContentIndex(state);
      if (this.getStartOffset(currentContentIndex) !== PRE_CALCULATION
        && this.isContentCalculated(currentContentIndex)) {
        this.dispatch(setReadyToRead(true));
      }
    }
  }

  setContentTotal(index, total) {
    if (!this.isContentCalculated(index)) {
      this.dispatch(index === FOOTER_INDEX
        ? updateFooterCalculation({ total, isCalculated: true })
        : updateContentCalculation({ index, total, isCalculated: true }));
      this.checkAllCompleted();
    }
  }

  getContentTotal(index) {
    if (index === FOOTER_INDEX) {
      const { total } = selectReaderFooterCalculations(this.getState());
      return total;
    }
    const calculatedContents = selectReaderContentsCalculations(this.getState());
    return calculatedContents[index - 1].total;
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
      if (typeof this.getStartOffset(nextIndex) === 'undefined') {
        break;
      }
      const contentRange = [this.getStartOffset(index), index === FOOTER_INDEX ? total : this.getStartOffset(nextIndex)];
      if (hasIntersect(range, contentRange)) {
        result.push(index);
      } else if (this.getStartOffset(index) > endOffset) {
        break;
      }
    }

    return result;
  }

  getIndexAtOffset(offset) {
    const calculations = selectReaderContentsCalculations(this.getState());
    const lastIndex = calculations.length;
    for (let index = 1; index <= lastIndex; index += 1) {
      const nextIndex = index === lastIndex ? FOOTER_INDEX : index + 1;
      // index === lastIndex ==> isFooter
      if (offset >= this.getStartOffset(index) && (index === FOOTER_INDEX || offset < this.getStartOffset(nextIndex))) {
        return index;
      }
    }
    return null;
  }

  isLastContent(index) {
    const calculatedContents = selectReaderContents(this.getState());
    return index === calculatedContents.length;
  }

  getCalculationTargetContents() {
    // TODO 값 관리
    const contentCountAtATime = 4;
    const calculatedContents = selectReaderContentsCalculations(this.getState());
    if (this.isCompleted()) return [];

    const result = calculatedContents
      .filter(({ isCalculated }) => !isCalculated)
      .map(({ index }) => index)
      .slice(0, contentCountAtATime);
    return result;
  }
}

export default new CalculationsConnector();

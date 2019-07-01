import { Content, Context, Reader } from '@ridi/reader.js/web';
import { EpubCalculationState, EpubCurrentState, EpubSettingState } from './contexts';
import { isScroll } from './utils/EpubSettingUtil';
import { getScrollLeft } from './utils/Util';

class ReaderJsHelper {
  private static instance: ReaderJsHelper;

  private readerJs: Reader;
  private currentState: EpubCurrentState;
  private calculationState: EpubCalculationState;
  private settingState: EpubSettingState;
  private contentsNum: number = 0;

  private constructor(context: Context, { currentState, calculationState, settingState }: { currentState: EpubCurrentState, calculationState: EpubCalculationState, settingState: EpubSettingState }) {
    this.readerJs = new Reader(context);
    this.currentState = currentState;
    this.calculationState = calculationState;
    this.settingState = settingState;
    (<any>window).reader = this.readerJs;
  }

  static init(context: Context, { currentState, calculationState, settingState }: { currentState: EpubCurrentState, calculationState: EpubCalculationState, settingState: EpubSettingState }) {
    if (this.instance) return;
    console.log('ReaderJsHelper.init()', context);
    this.instance = new ReaderJsHelper(context, { currentState, calculationState, settingState });
  }

  static updateContents(contentsRef: Array<HTMLElement>, contentWrapperRef: HTMLElement) {
    if (!this.instance) return;
    console.log('ReaderJsHelper.updateContents()', contentsRef, contentWrapperRef);
    this.instance.contentsNum = contentsRef.length;
    this.instance.readerJs.setContents(contentsRef, contentWrapperRef);
  }

  static updateContext(context: Context) {
    if (!this.instance) return;
    console.log('ReaderJsHelper.updateContext()', context);
    this.instance.readerJs.context = context;
  }

  static updateState({ currentState, calculationState, settingState }: { currentState: EpubCurrentState, calculationState: EpubCalculationState, settingState: EpubSettingState }) {
    if (!this.instance) return;
    this.instance.currentState = currentState;
    this.instance.calculationState = calculationState;
    this.instance.settingState = settingState;
  }

  static get(key?: number | string | HTMLElement ): Content | null {
    if (!this.instance) return null;
    let contentKey = (typeof key === 'undefined') ? this.instance.currentState.currentSpineIndex : key;
    contentKey = (typeof contentKey === 'string') ? parseInt(contentKey, 10) : contentKey;
    return this.instance.readerJs.getContent(contentKey);
  }

  /**
   * 특정 포인트로부터 Reader.js content 인스턴스를 반환한다.
   * @param x pageX
   * @param y pageY
   */
  static getByPoint(x: number, y: number): Content | null {
    if (!this.instance) return null;
    const { spines } = this.instance.calculationState;
    const scroll = isScroll(this.instance.settingState);
    const point = scroll ? y : x + getScrollLeft();
    const spine = spines.find(({ offset, total }) => point >= offset && point < offset + total);
    if (!spine) return null;
    return this.instance.readerJs.getContent(spine.spineIndex);
  }

  static reviseImages() {
    if (!this.instance) return;
    const revisePromises = [];
    for (let i = 0; i < this.instance.contentsNum; i++) {
      revisePromises.push(new Promise((resolve) => {
        try {
          const content = this.get(i);
          if (!content) {
            console.warn(`empty content(${i}) from ReaderJs`);
            return resolve();
          }
          content.reviseImages(resolve);
        } catch (e) {
          console.warn(e); // ignore error
          resolve();
        }
      }));
    }
    return Promise.all(revisePromises);
  }
}

export default ReaderJsHelper;
export { Context };

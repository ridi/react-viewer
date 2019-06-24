import { Content, Context, Reader } from '@ridi/reader.js/web';
import { EpubCurrentState } from './contexts';

class ReaderJsHelper {
  private static instance: ReaderJsHelper;

  private readerJs: Reader;
  private currentState: EpubCurrentState;
  private contentsNum: number = 0;

  private constructor(context: Context, { currentState }: { currentState: EpubCurrentState }) {
    this.readerJs = new Reader(context);
    this.currentState = currentState;
  }

  static init(context: Context, { currentState }: { currentState: EpubCurrentState }) {
    if (this.instance) return;
    console.log('ReaderJsHelper.init()', context);
    this.instance = new ReaderJsHelper(context, { currentState });
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

  static updateState({ currentState }: { currentState: EpubCurrentState }) {
    if (!this.instance) return;
    this.instance.currentState = currentState;
  }

  static get(key?: number | HTMLElement ): Content | null {
    if (!this.instance) return null;
    let contentKey = (typeof key === 'undefined') ? this.instance.currentState.currentSpineIndex : key;
    return this.instance.readerJs.getContent(contentKey);
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

import { Context, Reader, Util } from '@ridi/reader.js/web';
import { measure } from './util';

const DETECTION_TYPE = 'top'; // bottom or top
const EMPTY_READ_LOCATION = '-1#-1';

class ReaderJsHelper {
  private _readerJs: Reader | null = null;

  get readerJs() {
    return this._readerJs;
  }

  get sel() {
    return this._readerJs ? this._readerJs.sel : null;
  }

  get content() {
    return this._readerJs ? this._readerJs.content : null;
  }

  get context() {
    return this._readerJs ? this._readerJs.context : null;
  }

  _setDebugMode(debugMode = false) {
    if (this._readerJs) {
      this._readerJs.debugNodeLocation = debugMode;
    }
  }

  _createContext(node: HTMLElement, isScrollMode: boolean, maxSelectionLength: number = 1000) {
    const columnGap = Util.getStylePropertyIntValue(node, 'column-gap');
    const width = window.innerWidth - columnGap;
    const height = window.innerHeight;
    return new Context(width, height, columnGap, false, isScrollMode, maxSelectionLength);
  }

  mount(contentRoot: HTMLElement, isScroll: boolean) {
    if (this._readerJs) {
      this.unmount();
    }
    this._readerJs = new Reader(contentRoot, this._createContext(contentRoot, isScroll));
    this._setDebugMode(process.env.NODE_ENV === 'development');
  }

  unmount() {
    try {
      if (this._readerJs) {
        this._readerJs.unmount();
      }
    } catch (e) {
      /* ignore */
    }
    this._readerJs = null;
  }

  reviseImages() {
    return measure(() => new Promise((resolve) => {
      try {
        this.content.reviseImages(resolve);
      } catch (e) { /* ignore */
        console.warn(e);
        resolve();
      }
    }), 'revise images');
  }

  getOffsetFromNodeLocation(location: any): number | null {
    if (!this.readerJs) return null;
    if (location !== EMPTY_READ_LOCATION) {
      return this.readerJs.getOffsetFromNodeLocation(location, DETECTION_TYPE);
    }
    return null;
  }

  getNodeLocationOfCurrentPage(): string | null {
    if (!this.readerJs) return null;
    return this.readerJs.getNodeLocationOfCurrentPage(DETECTION_TYPE);
  }

  getRectsFromSerializedRange(serializedRange: string): Array<any> | null {
    if (!this.readerJs) return null;
    return this.readerJs.getRectsFromSerializedRange(serializedRange);
  }

  getOffsetFromSerializedRange(serializedRange: string): number | null {
    if (!this.readerJs) return null;
    return this.readerJs.getOffsetFromSerializedRange(serializedRange);
  }

  getOffsetFromAnchor(anchor: string): number | null {
    if (!this.readerJs) return null;
    return this.readerJs.getOffsetFromAnchor(anchor);
  }
}

export default new ReaderJsHelper();

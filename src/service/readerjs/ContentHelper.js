import ReaderJsHelper from './ReaderJsHelper';

class ContentHelper {
  getLinkFromElement(el) {
    try {
      return ReaderJsHelper.content.getLinkFromElement(el);
    } catch (e) {
      console.warn('[ContentHelper.getLinkFromElement]', e);
      return null;
    }
  }
}

export default new ContentHelper();

import ReaderJsHelper from './ReaderJsHelper';

class ContentHelper {
  getLinkFromElement(el) {
    return ReaderJsHelper.content.getLinkFromElement(el);
  }
}

export default new ContentHelper();

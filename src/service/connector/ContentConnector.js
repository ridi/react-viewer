import BaseConnector from './BaseConnector';
import {
  setContentsByValue,
  setContentsByUri,
  updateContent, updateContentError,
} from '../../redux/action';
import { selectReaderContentFormat, selectReaderContents } from '../../redux/selector';

class ContentConnector extends BaseConnector {
  setContentsByUri(contentFormat, bindingType, uris) {
    this.dispatch(setContentsByUri(contentFormat, bindingType, uris));
  }

  setContentsByValue(contentFormat, bindingType, contents) {
    this.dispatch(setContentsByValue(contentFormat, bindingType, contents));
  }

  getContents(index = null) {
    const contents = selectReaderContents(this.getState());
    if (index === null) {
      return contents;
    }
    return contents.find(content => content.index === index);
  }

  setContentLoaded(index, content) {
    const contents = this.getContents();
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);
    this.dispatch(updateContent(index, content, isAllLoaded));
  }

  setContentError(index, error) {
    const contents = this.getContents();
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);
    this.dispatch(updateContentError(index, error, isAllLoaded));
  }

  getContentFormat() {
    return selectReaderContentFormat(this.getState());
  }
}

export default new ContentConnector();

import BaseConnector from './BaseConnector';
import {
  setContentsByValue,
  setContentsByUri,
  updateContent,
  updateContentError,
  setContentsInScreen,
} from '../../redux/action';
import { selectReaderContentFormat, selectReaderContents, selectReaderIsContentsLoaded } from '../../redux/selector';
import SettingConnector from './SettingConnector';

class ContentConnector extends BaseConnector {
  setContentsByUri(contentFormat, bindingType, uris) {
    const { startWithBlankPage, columnsInPage } = SettingConnector.getSetting();
    this.dispatch(setContentsByUri(contentFormat, bindingType, uris, startWithBlankPage / columnsInPage));
  }

  setContentsByValue(contentFormat, bindingType, contents) {
    const { startWithBlankPage, columnsInPage } = SettingConnector.getSetting();
    this.dispatch(setContentsByValue(contentFormat, bindingType, contents, startWithBlankPage / columnsInPage));
  }

  getContents(index = null) {
    const contents = selectReaderContents(this.getState());
    if (index === null) {
      return contents;
    }
    return contents.find(content => content.index === index);
  }

  setContentLoaded(index, content, ratio) {
    const contents = this.getContents();
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);

    this.dispatch(updateContent(index, content, isAllLoaded, ratio));
  }

  setContentError(index, error) {
    const contents = this.getContents();
    const isAllLoaded = contents.every(c => c.index === index || c.isContentLoaded || c.isContentOnError);
    this.dispatch(updateContentError(index, error, isAllLoaded));
  }

  updateContent(index, content, ratio) {
    const isAllLoaded = selectReaderIsContentsLoaded(this.getState());
    this.dispatch(updateContent(index, content, isAllLoaded, ratio));
  }

  getContentFormat() {
    return selectReaderContentFormat(this.getState());
  }

  setContentsInScreen(contentIndexes) {
    this.dispatch(setContentsInScreen(contentIndexes));
  }

  isContentsLoaded() {
    return selectReaderIsContentsLoaded(this.getState());
  }

  getContentsInScreen() {
    return this.getContents().filter(({ isInScreen }) => isInScreen).map(({ index }) => index);
  }
}

export default new ContentConnector();

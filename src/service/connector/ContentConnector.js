import BaseConnector from './BaseConnector';
import {
  setContentsByValue,
  setContentsByUri,
} from '../../redux/action';

class ContentConnector extends BaseConnector {
  setContentsByUri(contentFormat, bindingType, uris) {
    this.dispatch(setContentsByUri(contentFormat, bindingType, uris));
  }

  setContentsByValue(contentFormat, bindingType, contents) {
    this.dispatch(setContentsByValue(contentFormat, bindingType, contents));
  }
}

export default new ContentConnector();

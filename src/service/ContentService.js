import EventBus from '../event/EventBus';
import { LOADED, UNLOADED } from '../event/CoreEvents';
import { META_SET, WITH_CONTENT, CONTENT_LOADED } from '../event/ContentEvents';
import BaseService from './BaseService';

const contentMeta = [
  { index: 1, uri: './1' },
  { index: 2, uri: './2' },
  { index: 3, uri: './3' },
  { index: 4, uri: './4' },
  { index: 5, uri: './5' },
  { index: 6, uri: './6' },
];

class ContentService extends BaseService {
  listeningEvents = {
    [LOADED]: this.appLoaded.bind(this),
    [UNLOADED]: this.appUnloaded.bind(this),
  };

  _loadAllContents(contentMeta) {
    return Promise.all(contentMeta.map(({ uri, index }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ index, uri, content: `<div>${index}</div>` });
        }, 100);
      });
    }));
  }

  async appLoaded() {
    EventBus.emit(META_SET, contentMeta);
    const contents = await this._loadAllContents(contentMeta);
    EventBus.emit(WITH_CONTENT, contents);
    EventBus.emit(CONTENT_LOADED, { contentNumber: contents.length });
  }

  appUnloaded(appUnloaded) {

  }
}

export default new ContentService();

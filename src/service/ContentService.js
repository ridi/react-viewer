import EventBus, { Events } from '../event';
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
    [Events.core.LOADED]: this.appLoaded.bind(this),
    [Events.core.UNLOADED]: this.appUnloaded.bind(this),
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
    EventBus.emit(Events.content.META_SET, contentMeta);
    const contents = await this._loadAllContents(contentMeta);
    EventBus.emit(Events.content.WITH_CONTENT, contents);
    EventBus.emit(Events.content.CONTENT_LOADED, { contentNumber: contents.length });
  }

  appUnloaded(appUnloaded) {

  }
}

export default new ContentService();

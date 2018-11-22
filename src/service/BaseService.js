import EventBus from '../event/EventBus';
import Logger from '../util/Logger';

export default class BaseService {
  listeningEvents = {}; // event: observer

  load() {
    Object.getOwnPropertySymbols(this.listeningEvents)
      .forEach(eventName => EventBus.on(eventName, this.listeningEvents[eventName], this));
    Logger.debug(`${this.constructor.name} service was loaded.`);
  }

  unload() {
    EventBus.offByTarget(this);
  }

  afterLoaded() {}
  beforeUnloaded() {}
}

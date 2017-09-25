import { documentAddEventListener, documentRemoveEventListener } from './BrowserWrapper';
import { isExist } from './Util';

class EventDispatcher {
  constructor() {
    this.listenerMap = {};
    this.intervalMap = {};
    this.lastDistpatchedDateMap = {};
  }

  // 해당 이벤트 발생 후  만큼 시간이 지나지 않았는데 발생하는 경우 버림.
  addEventListener(event, func, delay) {
    this.listenerMap[event] = func;
    this.intervalMap[event] = delay;
    this.lastDistpatchedDateMap[event] = new Date();
    this.listener = e => this.eventDispatcher(e);
    documentAddEventListener(event, this.listener);
  }

  removeEventListener(event) {
    const func = this.listenerMap[event];
    if (!isExist(func)) {
      return;
    }

    delete this.listenerMap[event];
    delete this.intervalMap[event];
    delete this.lastDistpatchedDateMap[event];

    if (isExist(this.listener)) {
      documentRemoveEventListener(event, this.listener);
    }
  }

  eventDispatcher(e) {
    const type = e.type;
    const listener = this.listenerMap[type];
    const interval = this.intervalMap[type];
    const lastDispatchedDate = this.lastDistpatchedDateMap[type];
    const isReadyToDispatch = this._checkDispachable(lastDispatchedDate, interval);
    if (!isExist(listener) || !isReadyToDispatch) {
      return;
    }
    listener(e);
    this.lastDistpatchedDateMap[type] = new Date();
  }

  _checkDispachable(lastDispatchedDate, interval) {
    return new Date() - lastDispatchedDate > interval;
  }
}

const eventDispatcher = new EventDispatcher();
export default eventDispatcher;

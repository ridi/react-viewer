import { isExist, updateObject } from './Util';

class Connector {
  constructor() {
    this.store = undefined;
  }

  connect(store, options = {}) {
    this.store = store;

    this._options = updateObject(this._options, options);
    this.afterConnected();
  }

  afterConnected() {}

  isConnect() {
    return isExist(this.store);
  }

  dispatch(action) {
    this.throwIfNotConnected();
    return this.store.dispatch(action);
  }

  getState() {
    this.throwIfNotConnected();
    return this.store.getState();
  }

  throwIfNotConnected(message) {
    if (!this.isConnect()) {
      throw new Error(message || `${this.constructor.name}에 Store를 연결해주세요.`);
    }
  }
}

export default Connector;

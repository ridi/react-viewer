import { cloneObject, nullSafeSet } from './Util';


export default class ReducerBuilder {
  constructor(state) {
    this._state = cloneObject(state);
  }

  set(path, value) {
    nullSafeSet(this._state, path, value);
    return this;
  }

  build() {
    return this._state;
  }
}

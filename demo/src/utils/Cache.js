import store from 'store';

export default class Cache {
  constructor(key, keyGenerator = k => `${k}`) {
    this.getKey = keyGenerator.bind(this, key);
  }

  set(value) {
    store.set(this.getKey(), value);
  }

  get() {
    return store.get(this.getKey());
  }
}

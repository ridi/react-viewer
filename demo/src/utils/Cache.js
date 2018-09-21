import store from 'store';
import { screenHeight, screenWidth } from './BrowserWrapper';

export default class Cache {
  constructor(bookId) {
    this.bookId = bookId;
  }

  getKey() {
    return `${this.bookId}_${screenWidth()}x${screenHeight()}`;
  }

  set(value) {
    store.set(this.getKey(), value);
  }

  get() {
    return store.get(this.getKey());
  }
}

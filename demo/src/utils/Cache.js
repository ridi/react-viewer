import store from 'store';
import { screenHeight, screenWidth } from './BrowserWrapper';

export default class Cache {
  constructor(bookId, keyGenerator = id => `${id}_${screenWidth()}x${screenHeight()}`) {
    this.bookId = bookId;
    this.getKey = keyGenerator.bind(this, bookId);
  }

  set(value) {
    store.set(this.getKey(), value);
  }

  get() {
    return store.get(this.getKey());
  }
}

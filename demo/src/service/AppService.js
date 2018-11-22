import {
  EventBus,
  Events,
  Connector,
  Service,
  reducers as reader,
  load,
  unload,
} from '@ridi/react-viewer';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import ContentsData from '../../resources/contents/contents.json';
import viewer from '../redux/Viewer.reducer';
import {
  requestLoadContent,
  setAnnotations,
} from '../redux/Viewer.action';
import Cache from '../utils/Cache';
import { screenHeight, screenWidth } from '../utils/BrowserWrapper';
import { selectAnnotations } from '../redux/Viewer.selector';

class AppService {
  _store = null;
  _contentMeta = null;
  _readerCache = null;
  _annotationCache = null;

  get contentMeta() {
    return this._contentMeta;
  }

  get store() {
    return this._store;
  }

  constructor() {
    this.onLoaded = this.onLoaded.bind(this);
    this.onUnloaded = this.onUnloaded.bind(this);

    this._setContentMeta();
    this._setRedux();
    this._setCache();
    this._connectWithReactViewer();
  }

  _setContentMeta() {
    const { contents } = ContentsData;
    const queryParam = new URLSearchParams(window.location.search);

    const contentId = queryParam.get('contentId');
    const selected = contents.filter(content => content.id.toString() === contentId);
    this._contentMeta = selected.length === 1 ? selected[0] : contents[Math.floor(Math.random() * contents.length)];
  }

  _setRedux() {
    const rootReducer = combineReducers({
      viewer,
      reader: reader({
        setting: {
          font: 'kopup_dotum',
          containerHorizontalMargin: 30,
          containerVerticalMargin: 50,
        },
      }),
    });

    const enhancer = composeWithDevTools(applyMiddleware(thunk));
    this._store = createStore(rootReducer, {}, enhancer);
  }

  _setCache() {
    this._readerCache = new Cache(
      this._contentMeta.id,
      key => `${key}_${screenWidth()}x${screenHeight()}_${Connector.setting.getSetting().viewType}`,
    );
    this._annotationCache = new Cache(this._contentMeta.id);
  }

  _connectWithReactViewer() {
    Connector.connect(this._store);
    Service.loadAll();

    EventBus.on(Events.core.LOADED, this.onLoaded);
    EventBus.on(Events.core.UNLOADED, this.onUnloaded);
  }

  onLoaded() {
    const readerState = this._readerCache.get();
    if (readerState) {
      this._store.dispatch(load(readerState));
    } else {
      this._store.dispatch(requestLoadContent(this._contentMeta));
    }
    const annotationsState = this._annotationCache.get();
    if (annotationsState) {
      this._store.dispatch(setAnnotations(annotationsState));
    }
  }

  onUnloaded() {
    if (!Connector.core.isReaderLoaded() || !Connector.core.isReaderAllCalculated()) return;
    const currentState = Connector.core.getReaderState();
    this._readerCache.set(currentState);
    this._annotationCache.set(selectAnnotations(this._store.getState()));
    this._store.dispatch(unload());
  }
}

export default new AppService();

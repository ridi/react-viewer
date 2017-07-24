// TODO IMME: remove unused functions


export function isExist(object) {
  return object !== undefined && object !== null;
}

export function isEmpty(object) {
  if (!isExist(object)) {
    return true;
  }

  if (typeof object === 'string' || object instanceof String) {
    return object.trim() === '';
  }

  if (Array.isArray(object)) {
    return object.length === 0;
  }

  return false;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isObject(obj) {
  return !isArray(obj) && obj === Object(obj);
}

export const cloneObject = object => {
  if (object === null || typeof object !== 'object') {
    return object;
  }
  const _object = object.constructor();
  Object.keys(object).forEach(attr => {
    if (Object.prototype.hasOwnProperty.call(object, attr)) {
      _object[attr] = cloneObject(object[attr]);
    }
  });

  return _object;
};

export const cloneArray = array => array.reduce((previousArray, object) => {
  previousArray.push(cloneObject(object));
  return previousArray;
}, []);

function _updateObject(origin, target) {
  let _origin = origin;

  if (isObject(origin) && isObject(target)) {
    Object.keys(target).forEach(key => {
      if (typeof target[key] !== 'object' || origin[key] == null) {
        _origin[key] = target[key];
      } else {
        _origin[key] = _updateObject(origin[key], target[key]);
      }
    });
  } else {
    _origin = target;
  }

  return _origin;
}

export const updateObject = (origin, target, isNeedClone = true) => {
  if (!isExist(target)) {
    return origin;
  }

  const _origin = isNeedClone ? cloneObject(origin) : origin;
  return _updateObject(_origin, target);
};

export const shallowUpdateObject = (origin, target) => Object.assign({}, origin, target);

export const mergeObjects = objects => Object.assign({}, ...cloneArray(objects));

export function invert(object) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0, length = keys.length; i < length; ++i) {
    result[object[keys[i]]] = keys[i];
  }
  return result;
}

export function startsWith(string, target, position) {
  const pos = isExist(position) ? Math.min(position < 0 ? 0 : (+position || 0), string.length) : 0;
  return string.lastIndexOf(target, pos) === pos;
}

export function endsWith(string, target, position) {
  const length = string.length;
  let pos = !isExist(position) ? length : Math.min(position < 0 ? 0 : (+position || 0), length);
  pos -= target.length;
  return pos >= 0 && string.indexOf(target, pos) === pos;
}

export function rand(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

export function getMessageFromFailResponse(jqXHR, defaultMessage = '실패했습니다.') {
  let message = defaultMessage;
  if (isExist(jqXHR) && isExist(jqXHR.responseJSON) && isExist(jqXHR.responseJSON.message)) {
    message = jqXHR.responseJSON.message;
  }

  return message;
}

export function getCodeFromFailResponse(jqXHR) {
  if (!(isExist(jqXHR) && isExist(jqXHR.responseJSON) && isExist(jqXHR.responseJSON.code))) {
    return null;
  }
  return jqXHR.responseJSON.code;
}

export function getStatusFromFailResponse(jqXHR) {
  return jqXHR.status;
}

export function getLastDay() {
  return new Date('9999-12-31T23:59:59+09:00');
}

export function isExpired(expireDate) {
  const now = new Date();
  return now > expireDate;
}

export function sortItemsByIds(items, ids, getIdFn = null) {
  const _getIdFn = this.isExist(getIdFn) ? getIdFn : obj => obj.id;

  return items.sort((a, b) => (ids.indexOf(_getIdFn(a)) < ids.indexOf(_getIdFn(b)) ? -1 : 1));
}

export function findUrlFromString(text) {
  const urlRegex = new RegExp(/((http(s?)):\/\/)([0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}(:[0-9]+)?(\/\S*)?/gmi);
  return text.match(urlRegex);
}

export function getValues(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

export function dashToUnderBar(str) {
  return str.replace(/-/gi, '_');
}

export function underBarToDash(str) {
  return str.replace(/_/gi, '-');
}

export function objectToArray(object) {
  return Object.keys(object).map(key => object[key]);
}

export function nullSafeGet(object, path, defaultValue) {
  let refer = object;
  if (!isExist(object)) {
    return defaultValue;
  }
  path.every(key => {
    if (!isExist(refer[key])) {
      refer = defaultValue;
      return false;
    }
    refer = refer[key];
    return true;
  });
  return refer;
}

export function nullSafeSet(object, path, value) {
  let refer = object;
  if (!isExist(refer)) {
    refer = {};
  }
  path.forEach((key, index) => {
    if (index === path.length - 1) {
      refer[key] = value;
    } else if (!isExist(refer[key])) {
      refer[key] = {};
    }
    refer = refer[key];
  });
  return object;
}

export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getUnixTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

export function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

export function userAgentBrowser() {
  const ua = navigator.userAgent;
  let tem;
  let M = ua.match(/(opera|chrome|safari|firefox|msie|applewebkit|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: (tem[1] || '') };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) {
      return { name: 'Opera', version: tem[1] };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  return {
    name: M[0],
    version: M[1]
  };
}

export function hasEmoji(statement) {
  const emojiCodeRanges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]',
  ];
  return new RegExp(emojiCodeRanges.join('|')).test(statement);
}

export default {
  startsWith,
  endsWith,
  rand,
  userAgentBrowser,
  getMessageFromFailResponse,
  getCodeFromFailResponse,
  getStatusFromFailResponse,
  getLastDay,
  isExist,
  isEmpty,
  isExpired,
  sortItemsByIds,
  findUrlFromString,
  updateObject,
  replaceAll,
};

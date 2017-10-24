import { invert, isExist } from './Util';


function toList() {
  if (!isExist(this._LIST)) {
    throw new Error('_LIST가 존재하지 않습니다.');
  }
  return this._LIST;
}

function toString(type) {
  if (!isExist(this._STRING_MAP)) {
    throw new Error('_STRING_MAP이 존재하지 않습니다.');
  }
  return this._STRING_MAP[type] || '';
}

function toStringList() {
  if (!isExist(this._STRING_MAP) || !isExist(this._LIST)) {
    throw new Error('_STRING_MAP 혹은 _LIST가 존재하지 않습니다.');
  }

  return this._LIST.map(item => this._STRING_MAP[item]);
}

function fromString(string) {
  if (!isExist(this._STRING_MAP)) {
    throw new Error('_STRING_MAP이 존재하지 않습니다.');
  }
  const reverseMap = invert(this._STRING_MAP);
  return reverseMap[string] || '';
}

function getDefault() {
  if (!isExist(this._DEFAULT)) {
    throw new Error('_DEFAULT이 존재하지 않습니다.');
  }

  return this._DEFAULT;
}

export default function makeConstants(constants, customHandler = {}) {
  const _constants = constants;
  _constants.toList = toList.bind(_constants);
  _constants.toString = toString.bind(_constants);
  _constants.toStringList = toStringList.bind(_constants);
  _constants.fromString = fromString.bind(_constants);
  _constants.getDefault = getDefault.bind(_constants);

  Object.keys(customHandler).forEach((key) => {
    _constants[key] = customHandler[key].bind(_constants);
  });

  return _constants;
}

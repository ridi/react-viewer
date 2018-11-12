export const SelectionMode = {
  NORMAL: 'normal',
  USER_SELECTION: 'userSelection',
  AUTO_HIGHLIGHT: 'rangedAnnotation',
};

export const SelectionStyleType = {
  HIGHLIGHT: 'highlight',
  UNDERLINE: 'underline',
  STRIKE_OUT: 'strikeOut',
};

export const DefaultSelectionStyle = {
  [SelectionMode.NORMAL]: { color: 'rgb(31, 140, 230)', type: SelectionStyleType.HIGHLIGHT },
  [SelectionMode.USER_SELECTION]: { color: 'rgb(31, 140, 230)', type: SelectionStyleType.HIGHLIGHT },
  [SelectionMode.AUTO_HIGHLIGHT]: { color: 'rgb(231, 216, 124)', type: SelectionStyleType.HIGHLIGHT },
};

export const SelectionParts = {
  UPPER_HANDLE: 'upperHandle',
  LOWER_HANDLE: 'lowerHandle',
  TEXT: 'text',
};
